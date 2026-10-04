import { apiError } from "@/lib/errors/api-error.server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { fetchAuthenticatedBackend, getBackendBaseUrl } from "@/lib/auth/backend-fetch.server";
import { REFRESH_TOKEN_COOKIE_NAME } from "@/lib/auth/cookie-names";
import { getUserId } from "@/lib/auth/session.server";
import { isSameOriginMutation } from "@/lib/auth/csrf.server";

export async function POST(request: Request) {
  if (!isSameOriginMutation(request)) {
    return apiError({ error: "cross_origin_request_rejected" }, { status: 403 });
  }

  const cookieStore = await cookies();
  const sessionCookieName = process.env.SESSION_COOKIE_NAME ?? "session";
  const token = cookieStore.get(sessionCookieName)?.value;

  if (!token) {
    return clearSessionCookies(new NextResponse(null, { status: 204 }), sessionCookieName);
  }

  const userId = getUserId(token);
  if (!userId) {
    return clearSessionCookies(apiError({ error: "invalid_session" }, { status: 401 }), sessionCookieName);
  }

  const baseUrl = getBackendBaseUrl();
  if (!baseUrl) {
    return clearSessionCookies(
      apiError({ error: "authentication_not_configured" }, { status: 500 }),
      sessionCookieName,
    );
  }

  try {
    const backendResponse = await fetchAuthenticatedBackend(`${baseUrl}/logout`, token, {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: userId,
      signal: AbortSignal.timeout(15_000),
    });

    if (!backendResponse.ok) {
      const status = backendResponse.status >= 400 && backendResponse.status < 500
        ? backendResponse.status
        : 502;
      return clearSessionCookies(apiError({ error: "logout_failed" }, { status }), sessionCookieName);
    }
  } catch {
    return clearSessionCookies(
      apiError({ error: "logout_unavailable" }, { status: 502 }),
      sessionCookieName,
    );
  }

  return clearSessionCookies(new NextResponse(null, { status: 204 }), sessionCookieName);
}

function clearSessionCookies(response: NextResponse, sessionCookieName: string) {
  response.cookies.set({
    name: sessionCookieName,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  response.cookies.set({
    name: REFRESH_TOKEN_COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/api",
    maxAge: 0,
  });
  response.headers.set("Cache-Control", "no-store");
  return response;
}
