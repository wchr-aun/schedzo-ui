import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "./route";
import { REFRESH_TOKEN_COOKIE_NAME } from "@/lib/auth/cookie-names";

const { getCookie, setCookie } = vi.hoisted(() => ({ getCookie: vi.fn(), setCookie: vi.fn() }));
vi.mock("next/headers", () => ({ cookies: async () => ({ get: getCookie, set: setCookie }) }));

const sameOriginRequest = () => new Request("https://frontend.example/api/auth/disconnect", {
  method: "POST",
  headers: { Origin: "https://frontend.example" },
});

describe("disconnect route", () => {
  const fetchMock = vi.fn<typeof fetch>();

  beforeEach(() => {
    vi.stubEnv("BFF_API_KEY", "test-bff-key");
    vi.stubEnv("BASE_URL", "https://backend.example/");
    vi.stubEnv("SESSION_COOKIE_NAME", "monzo_session");
    getCookie.mockReset().mockImplementation((name: string) => {
      if (name === REFRESH_TOKEN_COOKIE_NAME) return { value: "refresh-secret" };
      if (name === "monzo_session") return { value: "expired-access" };
      return undefined;
    });
    setCookie.mockReset();
    fetchMock.mockReset().mockResolvedValue(new Response(null, { status: 204 }));
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("calls disconnect with the session token and clears session cookies", async () => {
    const response = await POST(sameOriginRequest());

    expect(response.status).toBe(204);
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(fetchMock).toHaveBeenCalledWith(
      "https://backend.example/disconnect",
      expect.objectContaining({
        method: "POST",
        headers: new Headers({
          Authorization: "Bearer expired-access",
          "X-BFF-API-Key": "test-bff-key",
        }),
        cache: "no-store",
      }),
    );
    expect(response.headers.get("set-cookie")).toContain("monzo_session=");
    expect(response.headers.get("set-cookie")).toContain(`${REFRESH_TOKEN_COOKIE_NAME}=`);
  });

  it("clears session cookies without calling the backend when already signed out", async () => {
    getCookie.mockReturnValue(undefined);

    const response = await POST(sameOriginRequest());

    expect(response.status).toBe(204);
    expect(fetchMock).not.toHaveBeenCalled();
    expect(response.headers.get("set-cookie")).toContain("Max-Age=0");
  });

  it("refreshes after a 401 and retries disconnect once", async () => {
    fetchMock
      .mockResolvedValueOnce(new Response(null, { status: 401 }))
      .mockResolvedValueOnce(Response.json({ token: "fresh-access", expiresIn: 60, refreshToken: "rotated-refresh", refreshExpiresIn: 600 }))
      .mockResolvedValueOnce(new Response(null, { status: 204 }));

    const response = await POST(sameOriginRequest());

    expect(response.status).toBe(204);
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      "https://backend.example/auth/refresh",
      expect.objectContaining({ body: JSON.stringify({ refresh_token: "refresh-secret" }) }),
    );
    expect(fetchMock).toHaveBeenNthCalledWith(
      3,
      "https://backend.example/disconnect",
      expect.objectContaining({
        method: "POST",
        headers: expect.any(Headers),
      }),
    );
    expect(new Headers(fetchMock.mock.calls[2][1]?.headers).get("Authorization")).toBe("Bearer fresh-access");
  });

  it("clears local session cookies if the backend rejects disconnect", async () => {
    fetchMock
      .mockResolvedValueOnce(new Response(null, { status: 401 }))
      .mockResolvedValueOnce(Response.json({ token: "fresh-access", expiresIn: 60, refreshToken: "rotated-refresh", refreshExpiresIn: 600 }))
      .mockResolvedValueOnce(new Response(null, { status: 401 }));

    const response = await POST(sameOriginRequest());

    expect(response.status).toBe(401);
    expect(response.headers.get("set-cookie")).toContain("Max-Age=0");
  });
});
