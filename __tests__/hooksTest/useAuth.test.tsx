import {
  mockMMKV,
  removeMock,
  setMock,
} from "@/__mocks__/react-native-mmkv.mock";
import { useAuth } from "@/hooks/useAuth";
import { act, renderHook } from "@testing-library/react-native";

global.fetch = jest.fn() as jest.Mock;

// in hooks i need to use act to wrap the code that causes state updates
// in components @testing-library/react-native provides a way to
// wrap the code that causes state updates in an act() function
jest.mock("react-native-mmkv", () => mockMMKV);

// Call login with invalid credentials
test("Call Login with invalid credentials", async () => {
  const { result } = renderHook(() => useAuth());

  // call login with empty email and password
  act(() => {
    result.current.login("", "");
  });
  expect(result.current.error).toBe("Email and password are required");
});

// Validate loading state
test("Validate loading state", async () => {
  (global.fetch as jest.Mock).mockImplementation(() => new Promise(() => {}));
  const { result } = renderHook(() => useAuth());

  act(() => {
    result.current.login("ali@gmail.com", "123456");
  });
  expect(result.current.loading).toBe(true);
  expect(result.current.error).toBe("");
});

// Validate success login
test("Validate success state", async () => {
  let resolveFetch: any;
  (global.fetch as jest.Mock).mockImplementation(
    () =>
      new Promise((resolve) => {
        resolveFetch = resolve;
      }),
  );
  const { result } = renderHook(() => useAuth());

  act(() => {
    result.current.login("ali@gmail.com", "123456");
  });
  await act(async () => {
    resolveFetch({
      ok: true,
      json: async () => ({ token: "123", name: "Ali" }),
    });
  });
  expect(result.current.loading).toBe(false);
  expect(result.current.user).toEqual({ token: "123", name: "Ali" });

  expect(setMock).toHaveBeenCalledWith(
    "user",
    JSON.stringify({ token: "123", name: "Ali" }),
  );
});

// Login failed
test("Login failed", async () => {
  let rejectFetch: any;
  (global.fetch as jest.Mock).mockImplementation(
    () =>
      new Promise((_, reject) => {
        rejectFetch = reject;
      }),
  );

  const { result } = renderHook(() => useAuth());
  act(() => {
    result.current.login("ali@gmail.com", "123456");
  });

  expect(result.current.loading).toBe(true);

  // reject
  await act(async () => {
    await rejectFetch(new Error());
  });

  expect(result.current.error).toBe("Login failed");
});

// login out and remove user from mmkv
test("Logout user and remove it from storage", async () => {
  const { result } = renderHook(() => useAuth());
  act(() => {
    result.current.logout();
  });
  expect(result.current.user).toBeNull();
  expect(removeMock).toHaveBeenCalledWith("user");
});
