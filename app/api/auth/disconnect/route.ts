import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { fetchAuthenticatedBackend, getBackendBaseUrl, refreshSession } from "@/lib/auth/backend-fetch.server";
import { REFRESH_TOKEN_COOKIE_NAME } from "@/lib/auth/cookie-names";
import { isSameOriginMutation } from "@/lib/auth/csrf.server";
import { apiError } from "@/lib/errors/api-error.server";

export async function POST(request: Request) {
  if (!isSameOriginMutation(request)) {
    return apiError({ error: "cross_origin_request_rejected" }, { status: 403 });
  }

  const sessionCookieName = process.env.SESSION_COOKIE_NAME ?? "session";
  const cookieStore = await cookies();
  const token = cookieStore.get(sessionCookieName)?.value;
  if (!token) return clearSessionCookies(new NextResponse(null, { status: 204 }), sessionCookieName);

  const baseUrl = getBackendBaseUrl();
  if (!baseUrl) {
    return clearSessionCookies(apiError({ error: "authentication_not_configured" }, { status: 500 }), sessionCookieName);
  }

  try {
    let backendResponse = await fetchAuthenticatedBackend(`${baseUrl}/disconnect`, token, {
      method: "POST",
      signal: AbortSignal.timeout(15_000),
    });

    if (backendResponse.status === 401) {
      const refreshResult = await refreshSession();
      if (refreshResult.tokens) {
        backendResponse = await fetchAuthenticatedBackend(
          `${baseUrl}/disconnect`,
          refreshResult.tokens.accessToken,
          {
            method: "POST",
            signal: AbortSignal.timeout(15_000),
          },
        );
      } else {
        return clearSessionCookies(
          apiError({ error: "disconnect_failed" }, { status: refreshResult.status }),
          sessionCookieName,
        );
      }
    }

    if (!backendResponse.ok) {
      const status = backendResponse.status >= 400 && backendResponse.status < 500
        ? backendResponse.status
        : 502;
      return clearSessionCookies(apiError({ error: "disconnect_failed" }, { status }), sessionCookieName);
    }
  } catch {
    return clearSessionCookies(
      apiError({ error: "disconnect_unavailable" }, { status: 502 }),
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
