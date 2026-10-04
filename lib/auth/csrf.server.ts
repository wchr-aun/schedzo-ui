import "server-only";

/** Reject browser mutation requests unless they came from this exact origin. */
export function isSameOriginMutation(request: Request): boolean {
  const target = new URL(request.url).origin;
  const origin = request.headers.get("origin");

  if (origin !== null) {
    return origin !== "null" && origin === target;
  }

  const referer = request.headers.get("referer");
  if (referer) {
    try {
      return new URL(referer).origin === target;
    } catch {
      return false;
    }
  }

  return false;
}
