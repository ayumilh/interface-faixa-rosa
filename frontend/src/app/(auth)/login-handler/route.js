// app/login-handler/route.js
export async function GET(request) {
  const cookie = request.headers.get("better-auth.session_token");

  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/me`, {
    method: "GET",
    headers: {
      cookie, // repassa os cookies do navegador
    },
    credentials: "include",
  });

  const data = await response.json();
  console.log("User fetched from backend:", data);

  return Response.json(data);
}
