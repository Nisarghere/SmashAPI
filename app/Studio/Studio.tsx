"use client";
import { Search } from "lucide-react";
import React, { useEffect, useState } from "react";
 import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiFetch } from "../lib/apiFetch";


interface Endpoints {
  id:string;
  path:string;
  method:string;
  description : string 
}

interface Api {
  _id: string;
  title: string;
  description: string;
  publisher: string;
  version: string;
  endpoints:Endpoints[];
  logo: string;
}

const Studio = () => {
  const [data, setdata] = useState<Api[]>([]);
  const [notification, setNotification] = useState("");
  const [searchedInput, setsearchedInput] = useState("");
  const [notificationType, setNotificationType] = useState<
    "success" | "error" | ""
  >("success");

  const router = useRouter();
  useEffect(() => {
    async function handleApiResponse() {
      try {
        const response = await apiFetch("/api/studio");

        const result = await response.json();
        if (!response.ok) {
          setdata([]);
          return;
        }
        setdata(result.api ?? []);
      } catch (err) {
        console.log(err);
      }    
    }
    handleApiResponse();
  }, []);

  const searchedData = data?.filter((api) =>
    api.title.toLowerCase().includes(searchedInput.toLowerCase()),
  );

  async function DeleteApi(apiId: string) {
    try {
      const response = await apiFetch(
        `/api/studio/delete/${apiId}`,
        {
          method: "DELETE",
        },
      );

      if (response.success) {
        setNotification(response.message);
        setNotificationType("success");

        router.refresh();

        setdata((prev) => prev.filter((api) => api._id != apiId));
      }

      setTimeout(() => {
        setNotification("");
        setNotificationType("");
      }, 2000);
    } catch (err) {
      if (err instanceof Error) {
        setNotification(err.message);
        setNotificationType("error");
      }
      setTimeout(() => {
        setNotification("");
        setNotificationType("");
      }, 3000);
    }
  }

  function handleEdit(id: string) {
    router.push(`http://localhost:3000/Publish?edit=${id}`);
  }

  return (
    <div className="min-h-screen bg-slate-100">
      {notification && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 px-4">
          <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-2xl">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">
              <span className="text-2xl">✓</span>
            </div>

            <h3 className="text-lg font-semibold text-slate-900">
              Notification
            </h3>

            <p className="mt-2 text-sm text-slate-600">{notification}</p>

            <button
              type="button"
              onClick={() => setNotification("")}
              className="mt-5 rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div className="relative flex flex-col items-center gap-4 px-4 sm:px-0 md:min-h-16 md:justify-center">
        <div>
          <div className="flex justify-center">
            <div className="relative mt-6 sm:mt-8 md:mt-0">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                value={searchedInput}
                onChange={(e) => setsearchedInput(e.target.value)}
                type="text"
                placeholder="Search..."
                className="w-72 rounded-md border border-gray-300 py-1 pl-9 pr-3 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#E4E4E7] sm:w-100 focus:sm:w-110"
              />
            </div>
          </div>
        </div>

        <Link
          href="/Publish"
          className="w-full px-4 sm:w-auto sm:px-0 md:absolute md:right-0 md:top-1/2 md:-translate-y-1/2 md:mr-7"
        >
          <button className="w-full rounded bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 sm:w-auto">
            + Add Api Projects
          </button>
        </Link>
      </div>

      <div className="m-5 rounded-2xl border border-blue-200 bg-white/50 p-4 sm:m-8 sm:p-5 md:m-14">
        <div className="flex flex-wrap justify-center gap-4 md:justify-start">
          {data.length === 0 && (
            <div className="flex mx-auto">
              <h2 className="text-lg font-semibold text-slate-600 ">You haven't published any API yet</h2>
            </div>
          )}

          {data.length > 0 && searchedData.length === 0 && (
            <div>No api found</div>
          )}

          {searchedData.map((api) => (
            <div
              key={api._id}
              className="group flex min-h-52 w-full flex-col justify-between rounded-xl border border-blue-100 bg-white p-5 shadow-sm transition-all duration-200 hover:border-blue-200 hover:shadow-md sm:w-90"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                      <div className="h-4 w-4 rounded-full bg-blue-500" />
                    </div>

                    <div>
                      <h3 className="font-semibold text-slate-800">
                        {api.title}
                      </h3>

                      <div className="mt-0.5 flex items-center gap-2">
                        <span className="text-xs text-blue-600">
                          v{api.version}
                        </span>
                        <span className="h-1 w-1 rounded-full bg-slate-300" />
                        <span className="text-xs text-emerald-600">
                          Published
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="mt-5 line-clamp-2 text-sm leading-5 text-slate-500">
                  {api.description}
                </p>
              </div>

              <div className="mt-6 flex flex-col gap-3 border-t border-blue-50 pt-4 sm:flex-row sm:items-center sm:justify-between">
                <span className="text-xs text-slate-400">{api.endpoints.length} endpoints</span>

                <div className="flex gap-2">
                  <button
                    onClick={() => DeleteApi(api._id)}
                    className="flex-1 rounded-lg border border-slate-200 px-3.5 py-2 text-sm font-medium text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 sm:flex-none"
                  >
                    Delete
                  </button>

                  <button
                    onClick={(e) => handleEdit(api._id)}
                    className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 sm:flex-none"
                  >
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Studio;
