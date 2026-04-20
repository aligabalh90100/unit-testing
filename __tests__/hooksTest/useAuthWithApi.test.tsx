import {
  mockMMKV,
  removeMock,
  setMock,
} from "@/__mocks__/react-native-mmkv.mock";
import { login } from "@/api/auth";
import { useAuthApi } from "@/hooks/useAuthWithApi";
import { act, cleanup, renderHook } from "@testing-library/react-native";

jest.mock("@/api/auth");
jest.mock("react-native-mmkv", () => mockMMKV);

const mockLogin = login as jest.Mock;

afterEach(() => {
  jest.clearAllMocks();
  cleanup();
});

describe("Test useLogin with api layer", () => {
  // no API call
  // error shown
  test("Invalid Input", async () => {
    const { result } = renderHook(() => useAuthApi());
    await act(async () => {
      await result.current.login();
    });

    expect(result.current.error).toEqual("Email and password are required");
    expect(mockLogin).toHaveBeenCalledTimes(0);
  });

  // loading state
  test("Loading state", async () => {
    mockLogin.mockImplementation(() => new Promise(() => {}));
    const { result } = renderHook(() => useAuthApi());

    act(() => {
      result.current.login("ali@gmail.com", "123456");
    });
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toEqual("");
  });

  // success state
  test("Success state", async () => {
    const MOCK_USER = { token: "124", name: "ali" };
    mockLogin.mockResolvedValueOnce(MOCK_USER);
    const { result } = renderHook(() => useAuthApi());

    await act(async () => {
      await result.current.login("ali@gmail.com", "123456");
    });
    expect(result.current.user).toEqual(MOCK_USER);
    expect(result.current.error).toEqual("");
    expect(result.current.loading).toBe(false);

    expect(setMock).toHaveBeenCalledWith("user", JSON.stringify(MOCK_USER));
  });

  // error state
  test("error state", async () => {
    const MOCK_USER = { token: "124", name: "ali" };
    mockLogin.mockRejectedValueOnce(new Error("Login Failed"));
    const { result } = renderHook(() => useAuthApi());

    await act(async () => {
      await result.current.login("ali@gmail.com", "123456");
    });
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe("Login Failed");
    expect(result.current.user).toBeNull();

    expect(setMock).not.toHaveBeenCalled();
  });

  // Logout
  // user cleared
  // storage.remove called
  test("Logout User", async () => {
    const MOCK_USER = { token: "124", name: "ali" };
    mockLogin.mockResolvedValueOnce(MOCK_USER);

    const { result } = renderHook(() => useAuthApi());

    // login first
    await act(async () => {
      await result.current.login("ali@gmail.com", "123456");
    });

    // then logout
    act(() => {
      result.current.logout();
    });

    expect(removeMock).toHaveBeenCalledWith("user");
    expect(result.current.user).toBeNull();
  });
});
