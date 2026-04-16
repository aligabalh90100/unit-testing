import { apiClient } from "@/api/client";

global.fetch = jest.fn();
const mockfetch = global.fetch as jest.Mock;

test("Api Client Success", async () => {
  const MOCK_DATA = { data: "test" };
  mockfetch.mockResolvedValueOnce({ json: async () => MOCK_DATA, ok: true });
  //  this syntax i tell the behavior of the function
  const result = apiClient("/test");
  expect(result).resolves.toEqual(MOCK_DATA);

  // this syntax i check for the value after execution
  // const result = await apiClient("/test");
  // expect(result).toEqual(MOCK_DATA);
});

test("Api Client Not 200", async () => {
  mockfetch.mockResolvedValueOnce({
    json: async () => ({ message: "Request failed" }),
    ok: false,
  });
  const result = apiClient("/test");
  expect(result).rejects.toThrow("Request failed");

  // const result = await apiClient("/test");
  // expect(result).rejects.toThrow("Request failed");
  // await expect(apiClient("/test")).rejects.toThrow("Server error");
});

test("Catch error", async () => {
  mockfetch.mockRejectedValueOnce(new Error("Test error"));
  const result = apiClient("/test");
  expect(result).rejects.toThrow("Test error");
});
