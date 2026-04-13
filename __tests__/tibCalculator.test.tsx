import TipCalculator from "@/app/tipCalculator";
import { render, screen, userEvent } from "@testing-library/react-native";

function getInputsAndButtons(tip: 10 | 15 | 20 = 10) {
  const { getByTestId } = render(<TipCalculator />);
  const billInput = getByTestId("bill-input");
  const tipButton = getByTestId(`tip-btn-${tip}`);
  const user = userEvent.setup();
  const tipResult = getByTestId("tip-result");
  const totalResult = getByTestId("total-result");
  return { billInput, tipButton, user, tipResult, totalResult };
}
// if no bill and no tip should display $0.00
test("No bill And No Tip display $0.00", () => {
  const { totalResult, tipResult } = getInputsAndButtons();
  expect(tipResult).toHaveTextContent("$0.00");
  expect(totalResult).toHaveTextContent("$0.00");
});
const userTip: [10, 15, 20] = [10, 15, 20];
const userBills = [100, 200];
// user enter valid bill and selected tip 10
test("User Enter Valid bill [100,200] And Tip equal to [10,15,20]", async () => {
  for (let bill of userBills) {
    for (let tip of userTip) {
      const { billInput, tipButton, tipResult, totalResult, user } =
        getInputsAndButtons(tip);
      await user.type(billInput, bill.toString());
      await user.press(tipButton);
      expect(tipResult).toHaveTextContent(
        "$" + ((tip * bill) / 100).toFixed(2),
      );
      expect(totalResult).toHaveTextContent(
        "$" + (bill * (1 + tip / 100)).toFixed(2).toString(),
      );
    }
  }
});

// user enter negative number or letters display error message
test(" User inter negative number display error", async () => {
  const { billInput, user, tipButton } = getInputsAndButtons();
  await user.type(billInput, "-100");
  await user.press(tipButton);
  expect(screen.getByTestId("error-message")).toHaveTextContent(
    "Please enter a valid amount",
  );
});

// import TipCalculator from "@/app/tipCalculator";
// import { render, screen, userEvent, cleanup } from "@testing-library/react-native";

// // Clear the DOM between tests to avoid memory leaks
// afterEach(cleanup);

// describe("TipCalculator", () => {

//   test("initial state displays $0.00", () => {
//     render(<TipCalculator />);
//     expect(screen.getByTestId("tip-result")).toHaveTextContent("$0.00");
//     expect(screen.getByTestId("total-result")).toHaveTextContent("$0.00");
//   });

//   // Using test.each for clean, parameterized testing
//   test.each([
//     { bill: "100", tipPct: 10, expectedTip: "$10.00", expectedTotal: "$110.00" },
//     { bill: "200", tipPct: 20, expectedTip: "$40.00", expectedTotal: "$240.00" },
//   ])("calculates $tipPct% tip for a bill of $bill", async ({ bill, tipPct, expectedTip, expectedTotal }) => {
//     const user = userEvent.setup();
//     render(<TipCalculator />);

//     const input = screen.getByTestId("bill-input");
//     const btn = screen.getByTestId(`tip-btn-${tipPct}`);

//     await user.type(input, bill);
//     await user.press(btn);

//     expect(screen.getByTestId("tip-result")).toHaveTextContent(expectedTip);
//     expect(screen.getByTestId("total-result")).toHaveTextContent(expectedTotal);
//   });

//   test("shows error for negative numbers and hides it on fix", async () => {
//     const user = userEvent.setup();
//     render(<TipCalculator />);

//     const input = screen.getByTestId("bill-input");
//     const btn = screen.getByTestId("tip-btn-10");

//     // 1. Trigger error
//     await user.type(input, "-100");
//     await user.press(btn);
//     expect(screen.getByTestId("error-message")).toBeOnTheScreen();

//     // 2. Fix error
//     await user.clear(input);
//     await user.type(input, "100");
//     await user.press(btn);

//     // queryBy returns null instead of throwing error if not found
//     expect(screen.queryByTestId("error-message")).toBeNull();
//   });
// });
