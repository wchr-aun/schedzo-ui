import { apiError } from "@/lib/errors/api-error.server";
import { NextResponse } from "next/server";
import { refreshSession } from "@/lib/auth/backend-fetch.server";
import { isSameOriginMutation } from "@/lib/auth/csrf.server";

export async function POST(request: Request) {
  if (!isSameOriginMutation(request)) {
    return apiError({ error: "cross_origin_request_rejected" }, { status: 403 });
  }
  const result = await refreshSession();
  const response = result.status === 204
    ? new NextResponse(null, { status: 204 })
    : apiError({ error: "refresh_failed" }, { status: result.status });

  response.headers.set("Cache-Control", "no-store");
  return response;
}
