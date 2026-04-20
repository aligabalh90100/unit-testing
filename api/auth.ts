import { apiClient } from "./client";

export async function login<T>(email: string, password: string): Promise<T> {
  return apiClient("/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}
