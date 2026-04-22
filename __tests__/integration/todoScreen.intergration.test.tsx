import { TodoScreen } from "@/app/todoScreen";
import { render, userEvent } from "@testing-library/react-native";

global.fetch = jest.fn();
const mockFetch = global.fetch as jest.Mock;
const MOCK_TODOS = [
  { id: 1, title: "Todo 1", completed: false },
  { id: 2, title: "Todo 2", completed: false },
];
test("Todo Screen Integration Test", async () => {
  mockFetch
    .mockRejectedValueOnce(new Error("Failed to load todos"))
    .mockResolvedValueOnce({ json: async () => MOCK_TODOS });

  // render screen
  const {
    findByRole,
    findByText,
    queryByRole,
    queryByText,
    findByTestId,
    findByPlaceholderText,
  } = render(<TodoScreen />);

  // check for error
  const errorBtn = await findByRole("button", { name: /retry/i });
  const errorMessage = await findByText("Failed to load todos");

  expect(errorBtn).toBeOnTheScreen();
  expect(errorMessage).toBeOnTheScreen();

  // create user
  const user = userEvent.setup();
  await user.press(errorBtn);

  // check error is removed
  expect(queryByRole("button", { name: /retry/i })).toBeNull();
  expect(queryByText("Failed to load todos")).toBeNull();

  // check for todos rendered
  const todoList = await findByTestId("list");
  expect(todoList).toBeOnTheScreen();

  // check for adding todo
  const todoText = "Todo 3";
  const todoInput = await findByPlaceholderText("Add todo");
  const addTodoBtn = await findByRole("button", { name: /add/i });

  // user actions
  await user.type(todoInput, todoText);
  await user.press(addTodoBtn);
  expect(todoInput).toHaveDisplayValue("");

  const newTodoItem = await findByText(todoText);
  expect(newTodoItem).toBeOnTheScreen();

  // mark todo as completed
  const firstTodoItem = await findByTestId("todo-1");
  await user.press(firstTodoItem);
  const completedTodo = await findByText("Todo 1 ✅");
  expect(completedTodo).toBeOnTheScreen();
});
