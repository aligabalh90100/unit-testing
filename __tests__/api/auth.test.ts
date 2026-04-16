import { login } from "@/api/auth";
import { apiClient } from "@/api/client";

jest.mock("@/api/client");
const mockClient = apiClient as jest.Mock;

afterEach(() => {
  jest.clearAllMocks();
});
const MOCK_USER = { id: 1, name: "ali", email: "ali@gmail.com" };

test("Success Login", async () => {
  mockClient.mockResolvedValueOnce(MOCK_USER);

  await expect(login("ali", "mohamed")).resolves.toEqual(MOCK_USER);
});

test("Invalid Login", async () => {
  mockClient.mockRejectedValueOnce(new Error("Invalid Credentials"));

  await expect(login("ali", "mohamed")).rejects.toThrow("Invalid Credentials");
});

test("Check for body is correct", async () => {
  mockClient.mockResolvedValueOnce(MOCK_USER);
  const email = "ali@gmail.com";
  const password = "123456";
  login(email, password);

  // this will fail because i need to type the full object
  // expect(apiClient).toHaveBeenCalledWith("/login", {
  //   body: JSON.stringify({ email, password }),
  // });

  expect(apiClient).toHaveBeenCalledWith(
    "/login",
    expect.objectContaining({
      body: JSON.stringify({ email, password }),
      method: "POST",
    } as RequestInit),
  );
});
