import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { redirect } from "next/navigation";
import LoginForm from "./LoginForm";

export default async function LoginPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("jwt_token")?.value;

  if (typeof token === "string" && token) {
    jwt.verify(token, process.env.NEXT_PUBLIC_JWT_SECRET);
    redirect("/dashboard");
  }
  return <LoginForm />;
}
