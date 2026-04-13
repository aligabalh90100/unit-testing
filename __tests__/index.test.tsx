import { mockMMKV } from "@/__mocks__/react-native-mmkv.mock";
import Index from "@/app";
import { render, screen, userEvent } from "@testing-library/react-native";

// to mock function that needs native module jest must take inline function
// inline function that returns object
jest.mock("react-native-mmkv", () => mockMMKV);

function getInputsAndUser() {
  const { getByTestId } = render(<Index />);
  const priceInput = getByTestId("price");
  const codeInput = getByTestId("code");

  const user = userEvent.setup();
  return { user, priceInput, codeInput };
}
// test happy path user enters valid price and valid discount value
test("User Enter price and valid code", async () => {
  const { codeInput, priceInput, user } = getInputsAndUser();
  await user.type(priceInput, "100");
  await user.type(codeInput, "SAVE10");
  const discountText = screen.getByText(/Final Price: 90/);
  expect(discountText).toBeVisible();
});

// user enter price but enter invalid code
test("User Enter price with invalid code", async () => {
  const { codeInput, priceInput, user } = getInputsAndUser();
  await user.type(priceInput, "100");
  await user.type(codeInput, "Code");

  const discountText = screen.getByText(/Final Price: 100/);
  expect(discountText).toBeVisible();
});

// user enter valid code but leave the price input
test("User Enter valid code but price input is empty ", async () => {
  const { codeInput, priceInput, user } = getInputsAndUser();

  await user.type(codeInput, "SAVE20");
  const discountText = screen.getByText(/Final Price: 0/);
  expect(discountText).toBeVisible();
});

// user enter letter in price field return invalid price
test("User enters invalid price", async () => {
  const { priceInput, user } = getInputsAndUser();
  await user.type(priceInput, "45dfgf");
  const errorText = screen.getByText(/invalid price/i);
  expect(errorText).toBeVisible();
});
