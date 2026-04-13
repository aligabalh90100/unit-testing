import { mockMMKV } from "@/__mocks__/react-native-mmkv.mock";
import Login from "@/app/loginScreen";
import { render, userEvent, waitFor } from "@testing-library/react-native";
import { createMMKV } from "react-native-mmkv";

jest.mock("react-native-mmkv", () => mockMMKV);
global.fetch = jest.fn() as jest.Mock;
expect(global.fetch).not.toHaveBeenCalled();

afterEach(() => {
  jest.clearAllMocks();
});
const userData = {
  id: 1,
  name: "Leanne Graham",
  username: "Bret",
  email: "Sincere@april.biz",
  address: {
    street: "Kulas Light",
    suite: "Apt. 556",
    city: "Gwenborough",
    zipcode: "92998-3874",
    geo: {
      lat: "-37.3159",
      lng: "81.1496",
    },
  },
  phone: "1-770-736-8031 x56442",
  website: "hildegard.org",
  company: {
    name: "Romaguera-Crona",
    catchPhrase: "Multi-layered client-server neural-net",
    bs: "harness real-time e-markets",
  },
};
function initiate() {
  const container = render(<Login />);
  const emailInput = container.getByPlaceholderText("Email");
  const passwordInput = container.getByPlaceholderText("Password");
  const loginBtn = container.getByRole("button", { name: /login/i });
  const user = userEvent.setup();

  return { ...container, emailInput, passwordInput, loginBtn, user };
}
// user press login while no email or password gets error
test("User press login while no Email or Password", async () => {
  const { loginBtn, user, findByTestId } = initiate();

  await user.press(loginBtn);
  const errorMessage = await findByTestId("error");
  expect(errorMessage).toHaveTextContent("All fields are required");
});

// User type email and password then press login Loading appears
test("Loading appears after typing email and password then press login", async () => {
  (global.fetch as jest.Mock).mockImplementation(() => new Promise(() => {}));
  const { emailInput, passwordInput, user, loginBtn, findByTestId } =
    initiate();
  await user.type(emailInput, "ali@gmail.com");
  await user.type(passwordInput, "123456");
  await user.press(loginBtn);
  const loader = await findByTestId("loader");
  expect(loader).toBeOnTheScreen();
});

// Fetch success after user press login with email and password
test("Success Fetch", async () => {
  (global.fetch as jest.Mock).mockResolvedValueOnce({
    json: async () => userData,
  });
  const { emailInput, passwordInput, user, loginBtn } = initiate();
  await user.type(emailInput, "ali@gmail.com");
  await user.type(passwordInput, "123456");
  await user.press(loginBtn);

  await waitFor(() =>
    expect(createMMKV().set).toHaveBeenCalledWith(
      "user",
      JSON.stringify(userData),
    ),
  );
});

// Fetch fails after user press login with email and password
test("Failed Fetch", async () => {
  (global.fetch as jest.Mock).mockRejectedValueOnce(new Error("Login failed"));
  const { emailInput, passwordInput, user, loginBtn, findByTestId } =
    initiate();
  await user.type(emailInput, "ali@gmail.com");
  await user.type(passwordInput, "123456");
  await user.press(loginBtn);

  const errorMessage = await findByTestId("error");
  expect(errorMessage).toHaveTextContent("Login failed");
});

// simulates loading then success
// test("Loader appears then disappears after success", async () => {
//   let resolveFetch: any;

//   (global.fetch as jest.Mock).mockImplementation(
//     () =>
//       new Promise((resolve) => {
//         resolveFetch = resolve;
//       })
//   );

//   const {
//     emailInput,
//     passwordInput,
//     user,
//     loginBtn,
//     getByTestId,
//     queryByTestId,
//   } = initiate();

//   await user.type(emailInput, "ali@gmail.com");
//   await user.type(passwordInput, "123456");
//   await user.press(loginBtn);

//   // ✅ Loader SHOULD appear
//   expect(getByTestId("loader")).toBeTruthy();

//   // resolve fetch manually
//   resolveFetch({
//     json: async () => userData,
//   });

//   // ✅ Loader SHOULD disappear
//   await waitFor(() => {
//     expect(queryByTestId("loader")).toBeNull();
//   });
// });
