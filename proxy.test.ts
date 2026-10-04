import { NextRequest } from "next/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { proxy } from "./proxy";

describe("security headers", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("sends a nonce in the CSP and forwards it to the rendered page", () => {
    const response = proxy(new NextRequest("https://app.example/console"));
    const csp = response.headers.get("content-security-policy");
    const nonce = csp?.match(/'nonce-([^']+)'/)?.[1];

    expect(nonce).toBeTruthy();
    expect(csp).toContain("frame-ancestors 'none'");
    expect(response.headers.get("x-middleware-request-x-nonce")).toBe(nonce);
    expect(response.headers.get("x-content-type-options")).toBe("nosniff");
    expect(response.headers.get("referrer-policy")).toBe("no-referrer");
  });

  it("allows eval only in the development CSP", () => {
    vi.stubEnv("NODE_ENV", "development");
    const developmentCsp = proxy(new NextRequest("http://localhost/")).headers.get("content-security-policy");
    expect(developmentCsp).toContain("'unsafe-eval'");

    vi.stubEnv("NODE_ENV", "production");
    const productionCsp = proxy(new NextRequest("https://app.example/")).headers.get("content-security-policy");
    expect(productionCsp).not.toContain("'unsafe-eval'");
  });

  it("sets HSTS only in production", () => {
    vi.stubEnv("NODE_ENV", "production");
    expect(proxy(new NextRequest("https://app.example/")).headers.get("strict-transport-security"))
      .toBe("max-age=31536000");

    vi.stubEnv("NODE_ENV", "development");
    expect(proxy(new NextRequest("http://localhost/")).headers.get("strict-transport-security"))
      .toBeNull();
  });
});
