// api/users.ts
import { apiClient } from "./client";

export const searchUsers = (query: string) => {
  return apiClient<{ id: number; name: string }[]>(`/users?q=${query}`);
};
