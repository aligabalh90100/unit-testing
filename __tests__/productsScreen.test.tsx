import ProductDetails from "@/app/productDetails";
import Products from "@/app/productsScreen";
import { render, userEvent } from "@testing-library/react-native";
import { router, useLocalSearchParams } from "expo-router";

// mock router on expo router
jest.mock("expo-router", () => ({
  router: { push: jest.fn() },
  useLocalSearchParams: jest.fn(),
}));

// mock fetch
global.fetch = jest.fn() as jest.Mock;

// clean mockups
afterEach(() => {
  jest.clearAllMocks();
});
const products = [
  {
    userId: 1,
    id: 1,
    title:
      "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
    body: "quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto",
  },
  {
    userId: 1,
    id: 2,
    title: "qui est esse",
    body: "est rerum tempore vitae\nsequi sint nihil reprehenderit dolor beatae ea dolores neque\nfugiat blanditiis voluptate porro vel nihil molestiae ut reiciendis\nqui aperiam non debitis possimus qui neque nisi nulla",
  },
  {
    userId: 1,
    id: 3,
    title: "ea molestias quasi exercitationem repellat qui ipsa sit aut",
    body: "et iusto sed quo iure\nvoluptatem occaecati omnis eligendi aut ad\nvoluptatem doloribus vel accusantium quis pariatur\nmolestiae porro eius odio et labore et velit aut",
  },
];

// Fetch products list and render it
test("Fetch and render products list", async () => {
  // let resolveFetch: any;
  // (global.fetch as jest.Mock).mockImplementation(
  //   () =>
  //     new Promise((revolve) => {
  //       resolveFetch = revolve;
  //     }),
  // );
  (global.fetch as jest.Mock).mockResolvedValueOnce({
    json: async () => products,
  });
  const { findByTestId } = render(<Products />);
  // resolveFetch({ json: async () => products });
  const productsList = await findByTestId("products-list");
  expect(productsList.props.data).toHaveLength(3);
});

// Navigate when user press on product
test("Navigate after pressing on the product", async () => {
  let resolveFetch: any;
  (global.fetch as jest.Mock).mockImplementation(
    () =>
      new Promise((revolve) => {
        resolveFetch = revolve;
      }),
  );
  const { findAllByText } = render(<Products />);
  resolveFetch({ json: async () => products });

  const buttons = await findAllByText(/view details/i);

  const user = userEvent.setup();
  await user.press(buttons[0]);

  expect(router.push).toHaveBeenCalledWith({
    pathname: "/productDetails",
    params: { id: products[0].id, title: products[0].title },
  });
});

// product details get the correct params
test("Product details params", async () => {
  (useLocalSearchParams as jest.Mock).mockReturnValue({
    id: products[0].id,
    title: products[0].title,
  });
  const { getByTestId } = render(<ProductDetails />);
  const productId = products[0].id.toString();
  const productTitle = products[0].title;
  expect(getByTestId("details-id")).toHaveTextContent(`ID: ${productId}`);
  expect(getByTestId("details-title")).toHaveTextContent(productTitle);
});
