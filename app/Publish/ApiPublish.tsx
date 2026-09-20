"use client";
import { Ephesis } from "next/font/google";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useEffectEvent, useState } from "react";
import { apiFetch } from "../lib/apiFetch";

interface Endpoint {
  id: string;
  method: string;
  path: string;
  description: string;
}
interface Ratelimit {
  window: number;
  requests: number;
}

interface ApiSpec {
  title: string;
  baseurl: string;
  version: string;
  category: string;
  description: string;
  endpoints: Endpoint[];
}

interface ApiResponse {
  title: string;
  logo: string | null;
  baseUrl: string;
  version: string;
  category: string;
  description: string;
  endpoints: Endpoint[];
}

const ApiPublish = () => {
  const [title, setTitle] = useState("");
  const [description, setdescription] = useState("");
  const [baseurl, setBaseUrl] = useState("");
  const [version, setversion] = useState("");
  const [category, setcategory] = useState("");
  const [logo, setlogo] = useState<File | null>(null);
  const [data, setdata] = useState<ApiResponse | null>(null);
  const [logopreview, setlogopreview] = useState("");
  const [rateLimit, setrateLimit] = useState<Ratelimit>({
    window: 60,
    requests: 100,
  });
  const [endpoints, setendpoints] = useState<Endpoint[]>([
    {
      id: crypto.randomUUID(),
      method: "GET",
      path: "",
      description: "",
    },
  ]);
  const [editabledata, seteditabledata] = useState<ApiResponse | null>(null);
  const [notification, setNotification] = useState("");
  const [notificationStatus, setNotificationStatus] = useState<
    "success" | "error" | ""
  >("success");

  const searchParams = useSearchParams();

  const editQuery = searchParams.get("edit");
  const isEditing = !!editQuery;

  useEffect(() => {
    if (!isEditing) return;

    async function handleEdit() {
      try {
        const data = await apiFetch(`http://localhost:5000/api/${editQuery}`);
        seteditabledata(data.api);
      } catch (err) {
        console.log("Something went wrong while loading the API:", err);
      }
    }
    handleEdit();
  }, [isEditing, editQuery]);

  useEffect(() => {
    if (isEditing && editabledata) {
      setTitle(editabledata.title);
      setdescription(editabledata.description);
      setBaseUrl(editabledata.baseUrl);
      setversion(editabledata.version);
      setcategory(editabledata.category);
      setlogopreview(editabledata.logo ?? "");
      setendpoints(
        editabledata.endpoints.map((ep) => ({
          ...ep,
          id: ep.id ?? crypto.randomUUID(),
          method: (ep.method || "GET").toUpperCase(),
        })),
      );
    }
  }, [isEditing, editabledata]);

  async function handleUpdateApi() {
    const formData = new FormData();

    formData.append("title", title);
    formData.append("baseurl", baseurl);
    formData.append("version", version);
    formData.append("category", category);
    formData.append("description", description);
    formData.append("ratelimit", JSON.stringify(rateLimit));
    formData.append("endpoints", JSON.stringify(endpoints));
    if (logo) formData.append("logo", logo);

    try {
      const data = await apiFetch(
        `http://localhost:5000/api/publish/update/${editQuery}`,
        {
          method: "PATCH",
          body: formData,
        },
      );

      if (data.success) {
        setNotification(data.message);
        setNotificationStatus("success");
      }

      setTimeout(() => {
        setNotification("");
        setNotificationStatus("");
      }, 2000);
    } catch (err) {
      if (err instanceof Error) {
        setNotification(err.message);
        setNotificationStatus("error");
      }
      setTimeout(() => {
        setNotification("");
        setNotificationStatus("");
      }, 2000);
      console.log("Somethign went wrong : ", err);
    }
  }

  async function handleApi() {
    const formData = new FormData();

    formData.append("title", title);
    formData.append("baseurl", baseurl);
    formData.append("version", version);
    formData.append("category", category);
    formData.append("description", description);
    formData.append("ratelimit", JSON.stringify(rateLimit));
    formData.append("endpoints", JSON.stringify(endpoints));
    if (logo) formData.append("logo", logo);

    try {
      const response = await apiFetch("http://localhost:5000/api/publish", {
        method: "POST",
        body: formData,
      });
      console.log("SUCCESS RESPONSE:", response);
      if (response.success) {
        setNotification(response.message);
        setNotificationStatus("success");

        setTimeout(() => {
          setNotification("");
          setNotificationStatus("");
        }, 3000);
      }

      setlogopreview("");
      setTitle("");
      setdescription("");
      setendpoints([
        { id: crypto.randomUUID(), method: "GET", path: "", description: "" },
      ]);
      setversion("");
      setcategory("");
      setBaseUrl("");
    } catch (err) {
      if (err instanceof Error) {
        setNotification(err.message);
        setNotificationStatus("error");

        setTimeout(() => {
          setNotification("");
          setNotificationStatus("");
        }, 3000);
      }
      console.log("Somethign went wrong : ", err);
    }
  }
  console.log(editabledata?.endpoints);
  function AddPoint() {
    setendpoints((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        method: "GET",
        path: "",
        description: "",
      },
    ]);
  }

  function DeleteEndpoint(id: string) {
    const newEndpoint = endpoints.filter((endpoint) => endpoint.id !== id);
    setendpoints(newEndpoint);
  }

  const isDisabled = endpoints.some((ep) => ep.path.trim() === "");

  useEffect(() => {
    if (!logo) {
      setlogopreview("");
      return;
    }

    const url = URL.createObjectURL(logo);
    setlogopreview(url);

    return () => URL.revokeObjectURL(url);
  }, [logo]);

  return (
    <>
      <div className="min-h-screen bg-[#F6F8FB] px-6 py-10">
        {notification && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
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
        <div className="mx-auto max-w-4xl">
          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {isEditing ? "Edit API" : "Publish API"}
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Add your API details and configure the endpoints you want to
              expose.
            </p>
          </div>

          <div className="space-y-6">
            <section className="rounded-xl border border-slate-200 bg-white p-6">
              <div className="mb-6">
                <h2 className="text-base font-semibold text-slate-900">
                  API Information
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  Basic information about your API.
                </p>
              </div>

              <div className="space-y-5">
                <div className="flex justify-between md:flex-row gap-8 ">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      API Logo
                    </label>

                    <label className="flex h-30 w-30 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 text-xs text-slate-400 transition hover:border-slate-400 hover:bg-slate-100">
                      {logo && logopreview ? (
                        <img src={logopreview} alt="AVatar.png" />
                      ) : isEditing && editabledata?.logo ? (
                        <img src={editabledata?.logo} alt="AVatar.png" />
                      ) : (
                        <div className="text-[18px] font-semibold">Upload</div>
                      )}

                      <input
                        onChange={(e) => setlogo(e.target.files?.[0] ?? null)}
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        className="hidden"
                      />
                    </label>
                  </div>
                  <div className="flex flex-col w-130 ">
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      API Name
                    </label>

                    <input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      type="text"
                      placeholder="Weather API"
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-slate-400"
                    />
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">
                        Description
                      </label>
                      <textarea
                        value={description}
                        onChange={(e) => setdescription(e.target.value)}
                        className="w-full border rounded max-h-50 min-h-30 border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-slate-400"
                      ></textarea>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Base URL
                  </label>

                  <input
                    value={baseurl}
                    onChange={(e) => setBaseUrl(e.target.value)}
                    type="url"
                    placeholder="https://api.example.com"
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-slate-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Version
                    </label>

                    <input
                      value={version}
                      onChange={(e) => setversion(e.target.value)}
                      type="text"
                      placeholder="1.0.0"
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-slate-400"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Category
                    </label>

                    <select
                      value={category}
                      onChange={(e) => setcategory(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 outline-none focus:border-slate-400"
                    >
                      <option>Select category</option>
                       <option>Products</option>
                      <option>Weather</option>
                      <option>Development</option>
                      <option>Games</option>
                       <option>Other</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="mb-2 col-span-2 block text-sm font-medium text-slate-700">
                      Rate-Limit
                    </label>
                    <div className="flex gap-4">
                      <input
                        value={rateLimit.window}
                        onChange={(e) =>
                          setrateLimit((prev) => ({
                            ...prev,
                            window: Number(e.target.value),
                          }))
                        }
                        type="number"
                        min="1"
                        placeholder="Window"
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-slate-400"
                      />
                      <input
                        value={rateLimit.requests}
                        onChange={(e) =>
                          setrateLimit((prev) => ({
                            ...prev,
                            requests: Number(e.target.value),
                          }))
                        }
                        type="number"
                        min="1"
                        placeholder="Requests"
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-slate-400"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-xl border border-slate-200 bg-white p-6">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-semibold text-slate-900">
                    Endpoints
                  </h2>

                  <p className="mt-1 text-xs text-slate-400">
                    Define the routes available through your API.
                  </p>
                </div>

                <button
                  onClick={AddPoint}
                  disabled={isDisabled}
                  className={`rounded-lg border border-slate-200 ${isDisabled ? "bg-slate-400 cursor-not-allowed" : "bg-white hover:bg-slate-50"} px-3 py-2 text-sm font-medium text-slate-700 transition `}
                >
                  + Add Endpoint
                </button>
              </div>

              <div className="space-y-4">
                {endpoints.map((endpoint) => (
                  <div
                    key={endpoint.id}
                    className="rounded-xl border border-slate-200 bg-white p-4 transition hover:border-slate-300"
                  >
                    <div className="flex w-full items-start gap-5">
                      <select
                        value={endpoint.method}
                        onChange={(e) =>
                          setendpoints((prev) =>
                            prev.map((item) =>
                              item.id === endpoint.id
                                ? { ...item, method: e.target.value }
                                : item,
                            ),
                          )
                        }
                        className="mt-6 h-9 w-20 shrink-0 cursor-pointer rounded bg-emerald-100 px-3 text-sm font-semibold text-emerald-600 outline-none"
                      >
                        <option>GET</option>
                        <option>PUT</option>
                        <option>POST</option>
                        <option>PATCH</option>
                      </select>

                      {/* path and desc */}
                      <div className="min-w-0 flex-1 space-y-3">
                        <div>
                          <div className="mb-1.5 flex items-center justify-between">
                            <label className="block text-xs font-medium text-slate-500">
                              Endpoint path
                            </label>

                            <button
                              type="button"
                              disabled={endpoints.length === 1}
                              onClick={() => DeleteEndpoint(endpoint.id)}
                              className="rounded-lg p-1 text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                              aria-label="Remove endpoint"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M3 6h18" />
                                <path d="M8 6V4h8v2" />
                                <path d="M19 6l-1 14H6L5 6" />
                              </svg>
                            </button>
                          </div>

                          <input
                            value={endpoint.path}
                            onChange={(e) =>
                              setendpoints((prev) =>
                                prev.map((item) =>
                                  item.id === endpoint.id
                                    ? { ...item, path: e.target.value }
                                    : item,
                                ),
                              )
                            }
                            type="text"
                            placeholder="/users"
                            className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 font-mono text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-50"
                          />
                        </div>

                        <div>
                          <label className="mb-1.5 block text-xs font-medium text-slate-500">
                            Description (Optional)
                          </label>

                          <input
                            value={endpoint.description}
                            onChange={(e) =>
                              setendpoints((prev) =>
                                prev.map((item) =>
                                  item.id === endpoint.id
                                    ? { ...item, description: e.target.value }
                                    : item,
                                ),
                              )
                            }
                            type="text"
                            placeholder="Returns current weather information"
                            className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-50"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <div className="flex items-center justify-end gap-3 pb-6">
              <button className="rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50">
                Cancel
              </button>
              {isEditing ? (
                <button
                  onClick={handleUpdateApi}
                  className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700"
                >
                  Update API
                </button>
              ) : (
                <button
                  onClick={handleApi}
                  className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700"
                >
                  Publish API
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ApiPublish;
