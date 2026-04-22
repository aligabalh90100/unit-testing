import Products from "@/app/productsScreen";
import { render, userEvent } from "@testing-library/react-native";
import { router } from "expo-router";

global.fetch = jest.fn();
const mockFetch = global.fetch as jest.Mock;

const MOCK_PRODUCTS = [
  { id: 1, title: "Product 1" },
  { id: 2, title: "Product 2" },
];

jest.mock("expo-router", () => ({ router: { push: jest.fn() } }));
test("Products screen flow", async () => {
  mockFetch.mockResolvedValueOnce({ json: async () => MOCK_PRODUCTS });
  // render the ui
  const { findAllByRole } = render(<Products />);

  // list rendered
  const productsList = await findAllByRole("button", {
    name: /view details/i,
  });

  expect(productsList).toHaveLength(2);

  // user press in products
  const user = userEvent.setup();
  await user.press(productsList[0]);
  // navigate to product details with params
  expect(router.push).toHaveBeenLastCalledWith({
    pathname: "/productDetails",
    params: { id: MOCK_PRODUCTS[0].id, title: MOCK_PRODUCTS[0].title },
  });
});
