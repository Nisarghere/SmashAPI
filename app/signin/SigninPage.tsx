"use client";

import Link from "next/link";
import AuthLayout from "../components/AuthLayout";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { apiFetch } from "../lib/apiFetch";
interface SigninPayload {
  email: string;
  password: string;
}

export default function SigninPage() {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");

  const router = useRouter();
  async function HandleSignIn(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const payload: SigninPayload = { email, password };

    try {
      const response = await apiFetch("/auth/login", {
        method: "POST",
         headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      console.log(data);

      if (response.ok) {
        toast("Login successful");
        setTimeout(() => {
          router.push("/");
        }, 2000);
      } else {
        toast(data.message || "Login failed"); // show backend's actual error if it sends one
      }
    } catch (error) {
      console.log("something went wrong", error);
    }
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to continue to your API workspace."
      bottomText="Don't have an account?"
      bottomLinkText="Sign up"
      bottomLinkHref="/signup"
    >
      <ToastContainer />
      <form onSubmit={HandleSignIn} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Email
          </label>

          <input
            value={email}
            onChange={(e) => setemail(e.target.value)}
            type="email"
            placeholder="you@example.com"
            className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-3 focus:ring-blue-100 sm:h-11 sm:text-sm"
          />
        </div>

        <div>
          <div className="mb-1.5 flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
            <label className="text-sm font-medium text-slate-700">
              Password
            </label>

            <Link
              href="/forgot-password"
              className="text-xs font-medium text-blue-600 hover:text-blue-700"
            >
              Forgot password?
            </Link>
          </div>

          <input
            value={password}
            onChange={(e) => setpassword(e.target.value)}
            type="password"
            placeholder="••••••••"
            className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-3 focus:ring-blue-100 sm:h-11 sm:text-sm"
          />
        </div>

        <button
          type="submit"
          className="mt-2 h-11 w-full rounded-lg bg-blue-600 text-sm font-medium text-white transition hover:bg-blue-700 active:bg-blue-800"
        >
          Sign in
        </button>
      </form>
    </AuthLayout>
  );
}
