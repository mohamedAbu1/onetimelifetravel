import jwt from "jsonwebtoken";

export function getTokenFromRequest(request) {
  return request.cookies.get("access-token")?.value || null;
}

export function getAuthenticatedUser(request) {
  const token = getTokenFromRequest(request);
  if (!token || !process.env.JWT_SECRET) return null;

  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return null;
  }
}

export function unauthorized() {
  return Response.json({ error: "Unauthorized" }, { status: 401 });
}

export function forbidden() {
  return Response.json({ error: "Forbidden" }, { status: 403 });
}

export function isAdmin(user) {
  return user?.role === "ADMIN" || user?.role === "admin";
}

export function setAuthCookies(response, accessToken, refreshToken) {
  const secure = process.env.NODE_ENV === "production";
  response.cookies.set("access-token", accessToken, {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 15,
  });
  if (refreshToken) {
    response.cookies.set("refresh-token", refreshToken, {
      httpOnly: true,
      secure,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
  }
  return response;
}
