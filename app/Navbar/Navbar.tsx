"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { apiFetch } from "../lib/apiFetch";
import { useRouter } from "next/navigation";

interface NavLink {
  id: string;
  name: string;
  href: string;
}

const navlinks: NavLink[] = [
  { id: "1", name: "Home", href: "/" },
  { id: "2", name: "APIs", href: "/apis" },
  { id: "3", name: "Publish", href: "/Publish" },
  { id: "4", name: "Studio", href: "/Studio" },
];

export default function Navbar() {
  const [scrolled, setscrolled] = useState(false);
  const [isLoggedIn, setisLoggedIn] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setscrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await apiFetch("/auth/me");

        if (response.success) {
          setisLoggedIn(true);
        }
      } catch (err) {
        console.log(err);
        setisLoggedIn(false);
      }
    }
    checkAuth();
  }, []);

  async function handleLogout() {
    try {
      const response = await apiFetch("/auth/logout", {
        method: "POST",
      });

      if (response.success) {
        setisLoggedIn(false);
        router.refresh();
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <nav
      className={`sticky top-0 z-50 grid grid-cols-2 items-center gap-y-2 border-b border-slate-200/80 bg-white/90 backdrop-blur-sm transition-all duration-300 md:grid-cols-3 md:gap-y-0 ${
        scrolled
          ? "px-4 py-2 shadow-sm sm:px-6 md:px-8"
          : "px-4 py-3 sm:px-6 md:px-8"
      }`}
    >
      <Link
        href={"/"}
        className={`cursor-pointer font-bold text-slate-900 transition-all duration-300 ${
          scrolled ? "text-lg sm:text-xl" : "text-xl sm:text-2xl"
        }`}
      >
        Smash<span className="text-blue-600">-API</span>
      </Link>

      <div className="order-last col-span-2 flex flex-wrap justify-center gap-x-5 gap-y-2 md:order-none md:col-span-1 md:gap-8">
        {navlinks.map((link) => (
          <Link
            key={link.id}
            href={link.href}
            className={`font-medium text-slate-600 transition-all duration-300 hover:text-blue-600 ${
              scrolled ? "text-xs sm:text-sm" : "text-sm sm:text-base"
            }`}
          >
            {link.name}
          </Link>
        ))}
      </div>

      <div className="flex justify-end gap-2 sm:gap-3">
        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className={`cursor-pointer rounded-full bg-red-500 font-semibold text-white transition-all duration-300 hover:bg-red-700 ${
              scrolled
                ? "px-4 py-1.5 text-xs sm:px-5 sm:text-sm"
                : "px-4 py-1.5 text-sm sm:px-5 sm:py-2 sm:text-base"
            }`}
          >
            Log-Out
          </button>
        ) : (
          <>
            <Link
              href={"signin"}
              className={`rounded-full font-semibold text-slate-700 transition-all duration-300 hover:text-blue-600 ${
                scrolled
                  ? "px-3 py-1.5 text-xs sm:px-4 sm:text-sm"
                  : "px-3 py-1.5 text-sm sm:px-4 sm:py-2 sm:text-base"
              }`}
            >
              Sign In
            </Link>

            <Link
              href={"signup"}
              className={`rounded-full bg-blue-600 font-semibold text-white transition-all duration-300 hover:bg-blue-700 ${
                scrolled
                  ? "px-4 py-1.5 text-xs sm:px-5 sm:text-sm"
                  : "px-4 py-1.5 text-sm sm:px-5 sm:py-2 sm:text-base"
              }`}
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
