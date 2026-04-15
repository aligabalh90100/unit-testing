import {
  getMock,
  mockMMKV,
  removeMock,
  setMock,
} from "@/__mocks__/react-native-mmkv.mock";
import { useProducts } from "@/hooks/useProducts";
import {
  act,
  cleanup,
  renderHook,
  waitFor,
} from "@testing-library/react-native";

jest.mock("react-native-mmkv", () => mockMMKV);
global.fetch = jest.fn();
const mockFetch = global.fetch as jest.Mock;

afterEach(() => {
  jest.clearAllMocks();
  cleanup();
});
const MOCK_PRODUCTS = [
  { id: 1, title: "Product 1" },
  { id: 2, title: "Product 2" },
];
//hook mount and initial loading is true
test("Initial loading (on mount)", async () => {
  (global.fetch as jest.Mock).mockImplementation(() => new Promise(() => {}));
  const { result } = renderHook(() => useProducts());

  expect(result.current.loading).toBe(true);
});

// mock fetch and resolve with success and set data
test("Success fetch", async () => {
  let resolveFetch: any;
  (global.fetch as jest.Mock).mockImplementation(
    () =>
      new Promise((resolve) => {
        resolveFetch = resolve;
      }),
  );
  const { result } = renderHook(() => useProducts());
  // dont need this line because it already called by useEffect
  // act(() => {
  //   result.current.fetchProducts();
  // });
  expect(result.current.loading).toBe(true);

  await act(async () => {
    resolveFetch({ ok: true, json: async () => MOCK_PRODUCTS });
  });
  expect(result.current.loading).toBe(false);
  expect(result.current.products).toEqual(MOCK_PRODUCTS);
  expect(setMock).toHaveBeenCalledWith(
    "products",
    JSON.stringify(MOCK_PRODUCTS),
  );
});

// Fetch fails (no cache)
test("Fetch fails (no cache)", async () => {
  let rejectFetch: any;
  mockFetch.mockImplementation(
    () =>
      new Promise((_, reject) => {
        rejectFetch = reject;
      }),
  );
  const { result } = renderHook(() => useProducts());

  expect(result.current.loading).toBe(true);

  await act(async () => {
    await rejectFetch(new Error("Failed to fetch products"));
  });
  expect(result.current.products).toHaveLength(0);
  expect(result.current.loading).toBe(false);
  expect(result.current.error).toBe("Failed to fetch products");
});

// Fetch fails (cache)
test("Fetch fails (cache)", async () => {
  // cache must be set before request fail
  getMock.mockReturnValueOnce(JSON.stringify(MOCK_PRODUCTS));
  mockFetch.mockRejectedValueOnce(new Error("Failed to fetch products"));
  const { result } = renderHook(() => useProducts());

  expect(result.current.loading).toBe(true);

  await waitFor(() => {
    expect(result.current.products).toEqual(MOCK_PRODUCTS);
  });
  expect(getMock).toHaveBeenCalledWith("products");
  expect(result.current.loading).toBe(false);
  expect(result.current.error).toBe("Failed to fetch products");
});

// Retry manually
test("Retry manually fetch called twice", () => {
  const { result } = renderHook(() => useProducts());

  act(() => {
    result.current.fetchProducts();
  });

  expect(mockFetch).toHaveBeenCalledTimes(2);
});

// clear products
test("Clear Products", () => {
  const { result } = renderHook(() => useProducts());
  act(() => {
    result.current.clearProducts();
  });
  expect(removeMock).toHaveBeenCalledWith("products");
  expect(result.current.products).toEqual([]);
});
