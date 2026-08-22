// Standard API response envelope per Architecture.md § 12
export function apiSuccess<T>(data: T, status = 200): Response {
  return Response.json({ success: true, data }, { status });
}

export function apiError(
  message: string,
  code: string,
  status = 400
): Response {
  return Response.json({ success: false, error: { message, code } }, { status });
}

export function apiUnauthorized(message = "Unauthorized"): Response {
  return apiError(message, "UNAUTHORIZED", 401);
}

export function apiForbidden(message = "Forbidden"): Response {
  return apiError(message, "FORBIDDEN", 403);
}

export function apiNotFound(resource = "Resource"): Response {
  return apiError(`${resource} not found`, "NOT_FOUND", 404);
}
