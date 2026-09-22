"use client";

import { useState } from "react";
import AuthLayout from "../components/AuthLayout";
import { ToastContainer, toast } from "react-toastify";
import { apiFetch } from "../lib/apiFetch";

interface signupPayload {
  name: string;
  email: string;
  password: string;
}

export default function SignupPage() {
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [ConfirmPasswd, setConfirmPasswd] = useState("");

  async function HandleSignUp(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (password !== ConfirmPasswd) {
      toast("Passwords do not match");
      return;
    }

    const payload: signupPayload = { name, email, password };

    try {
      const response = await apiFetch("/auth/register", {
        method: "POST",
         headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      console.log(data);

      if (response.success) {
        toast("signup successful");
      } else {
        toast(data.message || "SignUp failed"); // show backend's actual error if it sends one
      }
    } catch (error) {
      console.log("something went wrong" , error);
    }
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Build, publish, and consume APIs from one place."
      bottomText="Already have an account?"
      bottomLinkText="Sign in"
      bottomLinkHref="/signin"
    >
      <ToastContainer />

      <form onSubmit={HandleSignUp} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Full name
          </label>

          <input
            value={name}
            onChange={(e) => setname(e.target.value)}
            type="text"
            placeholder="John Doe"
            className="w-full h-11 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:ring-3 focus:ring-blue-100"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Email
          </label>

          <input
            value={email}
            onChange={(e) => setemail(e.target.value)}
            type="email"
            placeholder="you@example.com"
            className="w-full h-11 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:ring-3 focus:ring-blue-100"
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Password
          </label>

          <input
            value={password}
            onChange={(e) => setpassword(e.target.value)}
            type="password"
            placeholder="••••••••"
            className="w-full h-11 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:ring-3 focus:ring-blue-100"
          />
        </div>

        {/* Confirm password */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Confirm password
          </label>

          <input
            value={ConfirmPasswd}
            onChange={(e) => setConfirmPasswd(e.target.value)}
            type="password"
            placeholder="••••••••"
            className="w-full h-11 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:ring-3 focus:ring-blue-100"
          />
        </div>

        {/* Button */}
        <button
          type="submit"
          className="w-full h-11 mt-2 rounded-lg bg-blue-600 text-white text-sm font-medium transition hover:bg-blue-700 active:bg-blue-800"
        >
          Create account
        </button>
      </form>
    </AuthLayout>
  );
}
