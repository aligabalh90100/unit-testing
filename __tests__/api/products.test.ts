import { apiClient } from "@/api/client";
import { getProducts } from "@/api/products";

jest.mock("@/api/client");

const mockClient = apiClient as jest.Mock;

const MOCK_PRODUCTS = [{ id: 1, title: "book" }];
test("Test Products Api", async () => {
  mockClient.mockResolvedValueOnce(MOCK_PRODUCTS);

  const response = getProducts();
  expect(response).resolves.toEqual(MOCK_PRODUCTS);
});

test("Reject", async () => {
  mockClient.mockRejectedValueOnce(new Error("No Products"));

  await expect(getProducts()).rejects.toThrow("No Products");
});
