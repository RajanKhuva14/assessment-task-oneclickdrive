import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req) {
  const { email, password } = await req.json();

  if (
    email === process.env.NEXT_PUBLIC_USER_EMAIL &&
    password === process.env.NEXT_PUBLIC_USER_PASSWORD
  ) {
    const token = jwt.sign({ email }, process.env.NEXT_PUBLIC_JWT_SECRET, {
      expiresIn: "1h",
    });

    const response = NextResponse.json({ success: true });
    response.cookies.set("jwt_token", token, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60,
    });

    return response;
  }

  return NextResponse.json(
    { success: false, message: "Invalid credentials" },
    { status: 401 }
  );
}
