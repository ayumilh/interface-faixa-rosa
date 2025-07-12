const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function fetcher(path, options = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    credentials: "include",
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Erro ao buscar dados");
  }

  const contentType = res.headers.get("Content-Type") || "";

  if (contentType.includes("application/json")) {
    return res.json();
  }

  return res;
}
