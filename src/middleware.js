import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export function middleware(req) {
  const { cookies } = req;
  const token = cookies.get("jwt_token");

  if ((req.nextUrl.pathname.startsWith("/dashboard") || req.nextUrl.pathname.startsWith("/profile")) && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (req.nextUrl.pathname.startsWith("/login") && token && typeof token === "string") {
    try {
      jwt.verify(token, process.env.NEXT_PUBLIC_JWT_SECRET);
      return NextResponse.redirect(new URL("/dashboard", req.url));
    } catch (err) {
    }
  }

  if (token && typeof token === "string" && (req.nextUrl.pathname.startsWith("/dashboard") || req.nextUrl.pathname.startsWith("/profile"))) {
    try {
      jwt.verify(token, process.env.NEXT_PUBLIC_JWT_SECRET);
      return NextResponse.next();
    } catch (err) {
      console.error(err);
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard", "/login"],
};
