import { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GET } from "./route";

describe("callback route", () => {
  const fetchMock = vi.fn<typeof fetch>();
  const payload = {
    token: "private-access-token",
    expiresIn: 60,
    refreshToken: "private-refresh-token",
    refreshExpiresIn: 600,
  };

  function request(query = "code=private-code&state=private-state") {
    return new NextRequest(`https://frontend.example/api/auth/callback?${query}`, {
      headers: { Cookie: "monzo_oauth_state=private-state" },
    });
  }

  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
    vi.stubEnv("BFF_API_KEY", "test-bff-key");
    vi.stubEnv("BASE_URL", "https://backend.example");
    vi.stubEnv("SESSION_COOKIE_NAME", "custom-session");
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("sets the configured session cookie without exposing tokens in the body", async () => {
    fetchMock.mockResolvedValueOnce(Response.json(payload));
    const response = await GET(request());
    expect(response.status).toBe(204);
    expect(await response.text()).toBe("");
    expect(response.cookies.get("custom-session")?.value).toBe(payload.token);
    const headers = new Headers(fetchMock.mock.calls[0][1]?.headers);
    expect(headers.get("X-BFF-API-Key")).toBe("test-bff-key");
    expect(headers.get("Cookie")).toBe("monzo_oauth_state=private-state");
    expect(response.headers.get("X-BFF-API-Key")).toBeNull();
  });

  it.each(["code=private-code", "state=private-state"])("rejects missing parameters without contacting the backend: %s", async (query) => {
    expect((await GET(request(query))).status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("does not contact the backend or set cookies without the service key", async () => {
    vi.stubEnv("BFF_API_KEY", "");
    const response = await GET(request());
    expect(response.status).toBe(502);
    expect(fetchMock).not.toHaveBeenCalled();
    expect(response.headers.get("set-cookie")).toBeNull();
  });

  it("handles backend failures without setting cookies", async () => {
    fetchMock.mockResolvedValueOnce(new Response(null, { status: 500 }));
    const response = await GET(request());
    expect(response.status).toBe(502);
    expect(response.headers.get("set-cookie")).toBeNull();
  });

  it("identifies invalid duration types without setting cookies", async () => {
    fetchMock.mockResolvedValueOnce(Response.json({ ...payload, refreshExpiresIn: "600" }));
    const response = await GET(request());
    expect(await response.json()).toEqual({ source: "backend", error: "invalid_callback_response" });
    expect(response.headers.get("set-cookie")).toBeNull();
  });

  it("handles JSON parsing failures without exposing the exception message", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => { throw new SyntaxError("private-access-token private-code"); },
    } as unknown as Response);
    const response = await GET(request());
    expect(await response.json()).toEqual({ source: "backend", error: "callback_unavailable" });
    expect(response.headers.get("set-cookie")).toBeNull();
  });
});
