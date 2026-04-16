// api/client.ts
export async function apiClient<T>(
  url: string,
  options?: RequestInit,
): Promise<T> {
  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      throw new Error(errorBody.message || "Request failed");
    }

    return response.json();
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Network error");
  }
}
