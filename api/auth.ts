import { apiClient } from "./client";

export async function login(email: string, password: string) {
  return apiClient("/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}
