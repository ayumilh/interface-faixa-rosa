// app/api/me/route.js
export async function GET(request) {
  const cookie = request.headers.get("cookie");

  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/me`, {
    method: "GET",
    headers: {
      cookie, // repassa cookies do SSR
    },
    credentials: "include",
    cache: "no-store",
  });

  const data = await response.json();
  return Response.json(data);
}
