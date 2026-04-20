import { apiClient } from "./client";

export type Product = {
  id: number;
  title: string;
};

export async function searchProducts(query: string) {
  return apiClient<Product[]>(
    `https://api.com/products?q=${encodeURIComponent(query)}`,
  );
}
