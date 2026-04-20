import { getMock, mockMMKV } from "@/__mocks__/react-native-mmkv.mock";
import { searchProducts } from "@/api/productsAdvanced";
import { useSearchProducts } from "@/hooks/useSearchProducts";
import { act, renderHook } from "@testing-library/react-native";

jest.mock("@/api/productsAdvanced");
jest.mock("react-native-mmkv", () => mockMMKV);

jest.useFakeTimers();
const searchProductsMock = searchProducts as jest.Mock;
afterEach(() => {
  jest.clearAllMocks();
});
const MOCK_PRODUCTS = [
  { id: 1, title: "iphone 13" },
  { id: 2, title: "tea" },
];
describe("Test useSearchProducts Hook", () => {
  // Initial state
  // query = ""
  // results = []
  // loading = false
  // error = ""
  test("Call Hook with initial state no query", () => {
    const { result } = renderHook(() => useSearchProducts());

    expect(result.current.query).toEqual("");
    expect(result.current.results).toEqual([]);
    expect(result.current.loading).toBeFalsy();
    expect(result.current.error).toEqual("");
  });

  test("Debounce behavior", async () => {
    searchProductsMock.mockImplementation(() => new Promise(() => {}));
    const { result } = renderHook(() => useSearchProducts());

    act(() => {
      result.current.setQuery("a");
      result.current.setQuery("ab");
      result.current.setQuery("abc");
    });

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(searchProductsMock).toHaveBeenCalledWith("abc");
    expect(searchProductsMock).toHaveBeenCalledTimes(1);
  });

  // //   Loading state
  // // 👉 When query changes
  // // ✅ Expect:
  // // loading = true before resolve
  test("Check for loading state when query change", async () => {
    searchProductsMock.mockImplementation(() => new Promise(() => {}));
    const { result } = renderHook(() => useSearchProducts());

    act(() => {
      result.current.setQuery("iphone");
    });
    act(() => {
      jest.advanceTimersByTime(500);
    });
    expect(result.current.loading).toBeTruthy();
  });

  test("Success Fetch", async () => {
    searchProductsMock.mockResolvedValueOnce(MOCK_PRODUCTS);
    const { result } = renderHook(() => useSearchProducts());

    act(() => {
      result.current.setQuery("iphone");
    });
    await act(async () => {
      jest.advanceTimersByTime(500);
    });
    expect(result.current.results).toEqual(MOCK_PRODUCTS);
    expect(result.current.loading).toBeFalsy();
    expect(result.current.error).toEqual("");
  });

  test("Error State", async () => {
    searchProductsMock.mockRejectedValueOnce(
      new Error("Failed to fetch products"),
    );

    const { result } = renderHook(() => useSearchProducts());

    act(() => {
      result.current.setQuery("tv");
    });
    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    expect(result.current.loading).toBeFalsy();
    expect(result.current.error).toEqual("Failed to fetch products");
  });

  test("Retry fall fetch fail then press retry", async () => {
    searchProductsMock.mockRejectedValueOnce(
      new Error("failed to fetch products"),
    );

    const { result } = renderHook(() => useSearchProducts());

    act(() => {
      result.current.setQuery("samsung tc");
    });
    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    expect(result.current.results).toEqual([]);
    expect(result.current.loading).toBeFalsy();
    expect(result.current.error).toEqual("failed to fetch products");

    await act(async () => {
      result.current.retry();
    });
    expect(searchProductsMock).toHaveBeenCalledTimes(2);
    expect(searchProductsMock).toHaveBeenCalledWith("samsung tc");
  });

  test("Cache test ", async () => {
    searchProductsMock.mockResolvedValueOnce(MOCK_PRODUCTS);
    getMock.mockReturnValueOnce(undefined).mockReturnValueOnce(MOCK_PRODUCTS);

    const { result } = renderHook(() => useSearchProducts());

    act(() => {
      result.current.setQuery("mobile");
    });
    await act(async () => {
      jest.advanceTimersByTime(500);
    });
    act(() => {
      result.current.setQuery("");
    });
    act(() => {
      result.current.setQuery("mobile");
    });
    await act(async () => {
      jest.advanceTimersByTime(500);
    });
    expect(searchProductsMock).toHaveBeenCalledTimes(1);
    expect(getMock).toHaveBeenCalledWith("mobile");
    expect(result.current.results).toEqual(MOCK_PRODUCTS);
  });

  // query "a" → slow
  // query "ab" → fast

  // ✅ Expect:

  // ONLY "ab" results are used
  test("Race condition", async () => {
    let resolve1: any, resolve2: any;

    searchProductsMock
      .mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            resolve1 = resolve;
          }),
      )
      .mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            resolve2 = resolve;
          }),
      );
    const { result } = renderHook(() => useSearchProducts());

    act(() => {
      result.current.setQuery("a");
    });
    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    act(() => {
      result.current.setQuery("ab");
    });
    await act(async () => {
      jest.advanceTimersByTime(500);
    });
    await act(async () => {
      resolve2(MOCK_PRODUCTS);
    });

    await act(async () => {
      resolve1([]);
    });
    expect(searchProductsMock).toHaveBeenCalledTimes(2);
    expect(searchProductsMock).toHaveBeenCalledWith("ab");
    expect(result.current.results).toEqual(MOCK_PRODUCTS);
  });

  test("Clear data", () => {
    const { result } = renderHook(() => useSearchProducts());
    act(() => {
      result.current.clear();
    });
    expect(result.current.query).toEqual("");
    expect(result.current.results).toEqual([]);
    expect(result.current.error).toEqual("");
  });
});
