// api/products.ts
import { apiClient } from "./client";

export type Product = {
  id: number;
  title: string;
};

export async function getProducts(): Promise<Product[]> {
  return apiClient<Product[]>("https://api.example.com/products");
}
