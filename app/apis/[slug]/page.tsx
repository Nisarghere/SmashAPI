import Navbar from "@/app/Navbar/Navbar";
import ApiHeader from "./ApiHeader";
import CodeExamples from "./Codeexamples";
import EndpointList from "./EndpointList";
import { cookies } from "next/headers";

const ApiDetailsPage = async ({ params }: { params: { slug: string } }) => {
  const { slug } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/${slug}`, {
    method: "GET",
    headers: {
      Cookie: `token=${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch API details");
  }
  const result = await response.json();
  const data = result.api;

 
  const openapiResponse = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/openapi/${slug}`,
    {
      method: "GET",
      headers: {
        Cookie: `token=${token}`,
      },
    },
  );
  
  if (!openapiResponse.ok) {
    throw new Error("Failed to fetch OpenAPI document");
  }
  const openapiDocument = await openapiResponse.json();

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-slate-50 px-6 py-8">
        <div className="mx-auto max-w-6xl space-y-6">
          <ApiHeader
            slug={slug}
            logo={data.logo}
            baseurl={data.baseUrl}
            title={data.title}
            version={data.version}
            ratelimit={data.ratelimit}
            category={data.category}
            description={data.description}
          />

          <EndpointList endpoints={data.endpoints} />  

          <CodeExamples openapiDocument={openapiDocument} />
        </div> 

      </div>
    </>
  );
};

export default ApiDetailsPage;
