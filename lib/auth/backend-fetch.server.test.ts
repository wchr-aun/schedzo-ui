import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fetchBackend, fetchAuthenticatedBackend, getBackendBaseUrl } from "./backend-fetch.server";

describe("getBackendBaseUrl", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("allows an HTTPS backend in production", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("BASE_URL", "https://backend.example/");
    expect(getBackendBaseUrl()).toBe("https://backend.example");
  });

  it("rejects a remote HTTP backend in production", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("BASE_URL", "http://backend.example");
    expect(getBackendBaseUrl()).toBeNull();
  });

  it("allows loopback HTTP for local development", () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("BASE_URL", "http://127.0.0.1:8000/");
    expect(getBackendBaseUrl()).toBe("http://127.0.0.1:8000");
  });

  it("rejects backend URLs with embedded credentials", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("BASE_URL", "https://user:pass@backend.example");
    expect(getBackendBaseUrl()).toBeNull();
  });
});

describe("backend service authentication", () => {
  const fetchMock = vi.fn<typeof fetch>();

  beforeEach(() => {
    vi.stubEnv("BASE_URL", "https://backend.example");
    vi.stubEnv("BFF_API_KEY", "test-bff-key");
    vi.stubGlobal("fetch", fetchMock);
    fetchMock.mockReset().mockResolvedValue(new Response(null, { status: 204 }));
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it.each([
    { Accept: "application/json", "x-bff-api-key": "untrusted-key" },
    new Headers({ Accept: "application/json", "x-bff-api-key": "untrusted-key" }),
    [["Accept", "application/json"], ["x-bff-api-key", "untrusted-key"]] as [string, string][],
  ])("uses the server credential and preserves headers for every HeadersInit form", async (headers) => {
    await fetchAuthenticatedBackend("https://backend.example/accounts", "user-token", { headers });
    const outgoing = new Headers(fetchMock.mock.calls[0][1]?.headers);
    expect(outgoing.get("X-BFF-API-Key")).toBe("test-bff-key");
    expect(outgoing.get("Authorization")).toBe("Bearer user-token");
    expect(outgoing.get("Accept")).toBe("application/json");
  });

  it.each([undefined, "", "   "])("does not contact the backend with a missing or blank key: %s", async (key) => {
    vi.stubEnv("BFF_API_KEY", key);
    await expect(fetchBackend("https://backend.example/accounts", {})).rejects.toThrow("not configured");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it.each(["https://other.example/accounts", "https://user:password@backend.example/accounts"])(
    "does not send credentials to an invalid destination: %s", async (url) => {
      await expect(fetchBackend(url, {})).rejects.toThrow("Invalid backend request destination");
      expect(fetchMock).not.toHaveBeenCalled();
    },
  );

  it("prevents redirect following even when requested by a caller", async () => {
    await fetchBackend("https://backend.example/accounts", { redirect: "follow", cache: "force-cache" });
    expect(fetchMock.mock.calls[0][1]).toMatchObject({ redirect: "error", cache: "no-store" });
  });
});
