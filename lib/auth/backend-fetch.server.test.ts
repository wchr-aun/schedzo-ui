import { afterEach, describe, expect, it, vi } from "vitest";
import { getBackendBaseUrl } from "./backend-fetch.server";

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
