interface Endpoint{
  _id:string;
  method:string;
  path:string;
  description:string |null;
}

interface ApiSpec {
  endpoints:Endpoint[]
}

const EndpointList = ({endpoints}:ApiSpec) => {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

  <div className="mb-5">
    <h2 className="text-lg font-semibold text-slate-800">
      Endpoints
    </h2>

    <p className="mt-1 text-sm text-slate-400">
      Available endpoints for this API.
    </p>
  </div>

  <div className="space-y-3">
    {endpoints.map((endpoint) => (
      <div
        key={endpoint._id}
        className="rounded-lg border border-slate-200 bg-slate-50 p-4 transition hover:border-slate-300 hover:bg-slate-50 hover:shadow-sm"
      >
        <div className="flex items-center gap-3">

          <span
            className={`rounded-md px-2.5 py-1 text-xs font-semibold ${
              endpoint.method === "GET"
                ? "border border-blue-200 bg-blue-50 text-blue-600"
                : endpoint.method === "POST"
                  ? "border border-green-200 bg-green-50 text-green-600"
                  : endpoint.method === "PUT"
                    ? "border border-amber-200 bg-amber-50 text-amber-600"
                    : endpoint.method === "DELETE"
                      ? "border border-red-200 bg-red-50 text-red-600"
                      : "border border-slate-200 bg-slate-100 text-slate-600"
            }`}
          >
            {endpoint.method}
          </span>

          <code className="font-mono text-sm font-medium text-slate-700">
            {endpoint.path}
          </code>

        </div>

        <p className="mt-3 text-sm leading-6 text-slate-500">
          {endpoint.description}
        </p>
      </div>
    ))}
  </div>

</div>
  );
};

export default EndpointList;