"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToaster } from "../../context/ToasterContext";
import { useLoading } from "@/context/Loader";
import { TextField } from "@mui/material";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const toaster = useToaster();
  const { showLoading, hideLoading } = useLoading();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    showLoading();

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        toaster.addToast("Login successful!", "success");
        router.push("/dashboard");
      } else {
        const data = await res.json();
        setError(data.message || "Login failed");
        toaster.addToast(data.message || "Login failed", "error");
      }
    } catch (error) {
      setError("Network error. Please try again.");
      toaster.addToast("Network error. Please try again.", "error");
    } finally {
      hideLoading();
    }
  };

  return (
    <>
      <div
        className="
        flex items-center justify-start w-full h-screen
        bg-[url('/assets/background-image.jpg')] bg-no-repeat bg-[length:100%_100%]
        relative "
      >
        <div
          className="
          fixed top-[63px] left-[77px]
          w-[200px] h-[74px]
        "
        >
          <img
            src="/assets/logo.svg"
            alt="auth-login"
            className="w-full h-full object-contain"
          />
        </div>

        <div className="flex px-[50px] flex-row-reverse w-full">
          <div className="flex flex-col items-start w-[520px] p-2.5">
            <h1
              className="
              m-0 text-[52px] leading-[62px] font-normal
              tracking-[-2px] text-[#252f40]
            "
            >
              Welcome Back!
            </h1>
            <span
              className="
              text-[18px] leading-[30px] font-normal
              text-[#67748e]
            "
            >
              Log in to continue
            </span>

            <form
              onSubmit={handleLogin}
              className="w-full mt-9"
              autoComplete="off"
            >
              <div className="flex flex-col gap-[25px] w-full">
                <div className="flex flex-col w-full">
                  <label
                    htmlFor="email"
                    className="text-[16px] leading-[24px] font-normal text-[#252f40] mb-1"
                  >
                    Email
                  </label>
                  <TextField
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    id="email"
                    name="email"
                    type="email"
                    className=" max-w-[520px] w-full h-[60px] bg-white border
                  border-[#e8e8e8] rounded-[4px] px-3 text-[#8b4513]  focus:outline-none"
                  />
                </div>

                <div className="flex flex-col w-full">
                  <label
                    htmlFor="password"
                    className="text-[16px] leading-[24px] font-normal text-[#252f40] mb-1 "
                  >
                    Password
                  </label>
                  <TextField
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    id="password"
                    name="password"
                    className="
                    max-w-[520px] w-full h-[60px]
                    bg-white border border-[#e8e8e8] rounded-[4px]
                    px-3 text-[#8b4513]
                    focus:outline-none
                  "
                  />
                </div>
              </div>

              <div className="flex items-center justify-between w-full mt-[35px]">
                <div className="flex items-center gap-[10px]">
                  <input
                    type="checkbox"
                    defaultChecked
                    sx={{
                      width: "19px",
                      height: "19px",
                      border: "1px solid #67748e",
                      borderRadius: "5px",
                      padding: 0,
                    }}
                  />
                  <span className="text-[14px] leading-[22px] font-normal text-[#252f40]">
                    Keep me signed in
                  </span>
                </div>
              </div>

              <button
                type="submit"
                className="
                w-[160px] h-[55px] mt-[35px]
                flex items-center justify-center
                font-normal text-[16px] leading-[28px]
                bg-[#413815] rounded-[9px]
              "
              >
                Log In
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
