export async function apiFetch(url: string, options: RequestInit = {}) {
  console.log(process.env.NEXT_PUBLIC_API_URL);
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
    ...options,
    credentials: "include",
  });

  if (!response.ok) {
    const errorText = await response.json();
    throw new Error(` ${response.status} ${errorText.message} `);
  }
  return response.json();
}
