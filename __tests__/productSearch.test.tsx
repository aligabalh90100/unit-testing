import { mockMMKV, setMock } from "@/__mocks__/react-native-mmkv.mock";
import ProductSearch from "@/app/productSearch";
import {
  cleanup,
  render,
  screen,
  userEvent,
} from "@testing-library/react-native";

// use getBy for elements that already exist in screen
// findBy for elements that will appear later
// queryBy for elements may not exist
jest.mock("react-native-mmkv", () => mockMMKV);

global.fetch = jest.fn() as jest.Mock;

afterEach(() => {
  cleanup();
  // this used to reset all mocks for each test
  jest.clearAllMocks();
});
// press search with no input user gets error
test("Press Search with no input value user gets error message", async () => {
  const { findByRole, findByTestId } = render(<ProductSearch />);
  const searchButton = await findByRole("button", { name: /search/i });
  const user = userEvent.setup();
  await user.press(searchButton);
  const errorMessage = await findByTestId("error");
  expect(errorMessage).toBeVisible();
});
// when input have value and user press search display loading state
test("Displaying Loading state", async () => {
  // this simulates promise that never return
  (global.fetch as jest.Mock).mockImplementation(() => new Promise(() => {}));
  const { findByRole, findByPlaceholderText, findByTestId } = render(
    <ProductSearch />,
  );
  const searchInput = await findByPlaceholderText("Search product");
  const searchButton = await findByRole("button", { name: /search/i });
  const user = userEvent.setup();
  await user.type(searchInput, "test");
  await user.press(searchButton);
  const loader = await findByTestId("loader");
  expect(loader).toBeVisible();
});

// user fetch data successfully
test("User fetch data", async () => {
  // this simulates data fetch and success
  (global.fetch as jest.Mock).mockResolvedValueOnce({
    json: async () => ({ title: "Test Product", price: 100 }),
  });
  const { findByPlaceholderText, findByRole, findByTestId } = render(
    <ProductSearch />,
  );
  const searchInput = await findByPlaceholderText("Search product");
  const searchButton = await findByRole("button", { name: /search/i });
  const user = userEvent.setup();
  await user.type(searchInput, "test");
  await user.press(searchButton);

  const productTitle = await findByTestId("product-title");
  const productPrice = await findByTestId("product-price");

  expect(productTitle).toBeVisible();
  expect(productPrice).toBeVisible();
  expect(global.fetch).toHaveBeenCalledTimes(1);
});

// user fetch data successfully
test("Fetching products fails", async () => {
  // this simulates data fetch and success
  (global.fetch as jest.Mock).mockRejectedValue(
    new Error("Something went wrong"),
  );
  const { findByPlaceholderText, findByRole, findByTestId } = render(
    <ProductSearch />,
  );
  const searchInput = await findByPlaceholderText("Search product");
  const searchButton = await findByRole("button", { name: /search/i });
  const user = userEvent.setup();
  await user.type(searchInput, "test");
  await user.press(searchButton);

  const errorMessage = await findByTestId("error");

  expect(errorMessage).toBeVisible();

  expect(global.fetch).toHaveBeenCalledTimes(1);
});

// this simulates storing data with mmkv
test("stores product in MMKV", async () => {
  (global.fetch as jest.Mock).mockResolvedValueOnce({
    json: async () => ({ title: "Test Product", price: 100 }),
  });

  const { getByPlaceholderText, getByRole } = render(<ProductSearch />);
  const user = userEvent.setup();

  await user.type(getByPlaceholderText("Search product"), "test");
  await user.press(getByRole("button", { name: /search/i }));

  await screen.findByText("Test Product");

  expect(setMock).toHaveBeenCalledWith(
    "lastProduct",
    JSON.stringify({
      title: "Test Product",
      price: 100,
    }),
  );
});
