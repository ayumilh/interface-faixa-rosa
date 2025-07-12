import { fetcher } from "../utils/fetcher.js";

// Login
export async function loginUser(email, password) {
  return fetcher("/api/auth/sign-in/email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
}

// Registro com arquivos (FormData)
export async function registerUser(formData) {
  return fetcher("/api/auth/sign-up/email", {
    method: "POST",
    body: formData,
  });
}
