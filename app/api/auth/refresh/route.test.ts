import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "./route";

const { getCookie, setCookie } = vi.hoisted(() => ({ getCookie: vi.fn(), setCookie: vi.fn() }));
vi.mock("next/headers", () => ({ cookies: async () => ({ get: getCookie, set: setCookie }) }));

describe("refresh route", () => {
  const fetchMock = vi.fn<typeof fetch>();
  beforeEach(() => {
    getCookie.mockReset().mockReturnValue({ value: "refresh-secret" });
    setCookie.mockReset();
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
    vi.stubEnv("BFF_API_KEY", "test-bff-key");
    vi.stubEnv("BASE_URL", "https://backend.example");
    vi.stubEnv("SESSION_COOKIE_NAME", "custom-session");
  });
  afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); });
  const sameOriginRequest = () => new Request("https://frontend.example/api/auth/refresh", { method: "POST", headers: { Origin: "https://frontend.example" } });

  it("exchanges the HttpOnly token in the backend body without exposing tokens", async () => {
    fetchMock.mockResolvedValueOnce(Response.json({ token: "access-secret", expiresIn: 60, refreshToken: "rotated-secret", refreshExpiresIn: 600 }));
    const response = await POST(sameOriginRequest());
    expect(response.status).toBe(204);
    expect(new Headers(fetchMock.mock.calls[0][1]?.headers).get("X-BFF-API-Key")).toBe("test-bff-key");
    expect(await response.text()).toBe("");
    expect(fetchMock).toHaveBeenCalledWith("https://backend.example/auth/refresh", expect.objectContaining({ method: "POST", body: JSON.stringify({ refresh_token: "refresh-secret" }) }));
    expect(setCookie).toHaveBeenCalledWith(expect.objectContaining({ name: "custom-session", value: "access-secret", httpOnly: true }));
    expect(setCookie).toHaveBeenCalledWith(expect.objectContaining({ name: "monzo_refresh_token", value: "rotated-secret", httpOnly: true }));
  });

  it("does not contact the backend or alter cookies without the service key", async () => {
    vi.stubEnv("BFF_API_KEY", "");
    expect((await POST(sameOriginRequest())).status).toBe(502);
    expect(fetchMock).not.toHaveBeenCalled();
    expect(setCookie).not.toHaveBeenCalled();
  });

  it("rejects missing cookies without contacting the backend", async () => {
    getCookie.mockReturnValue(undefined);
    expect((await POST(sameOriginRequest())).status).toBe(401);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("does not set cookies for malformed backend responses", async () => {
    fetchMock.mockResolvedValueOnce(Response.json({ token: "access-secret" }));
    expect((await POST(sameOriginRequest())).status).toBe(502);
    expect(setCookie).not.toHaveBeenCalled();
  });
});
