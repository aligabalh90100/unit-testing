import { TodoScreen } from "@/app/todoScreen";
import { cleanup, render, userEvent } from "@testing-library/react-native";

global.fetch = jest.fn();

const mockFetch = global.fetch as jest.Mock;

const MOCK_TODOS = [
  { id: 1, title: "Todo 1", completed: true },
  { id: 2, title: "Todo 2", completed: false },
];

afterEach(() => {
  jest.clearAllMocks();
  cleanup();
});

function initiate() {
  return render(<TodoScreen />);
}
//loading state
test("Testing Loading State", async () => {
  // simulate fetching (pending)
  mockFetch.mockImplementation(() => new Promise(() => {}));
  const { findByTestId } = initiate();
  const loader = await findByTestId("loader");

  expect(loader).toBeOnTheScreen();
});

// Success Fetching
test("Success Fetching", async () => {
  mockFetch.mockResolvedValueOnce({ json: async () => MOCK_TODOS });

  const { findByTestId } = initiate();

  const todosList = await findByTestId("list");

  expect(todosList).toBeOnTheScreen();
  expect(todosList.props.data).toHaveLength(2);
});

// Error State
// Mock fetch failure
// Error message appears
// Retry button exists
test("Error Fetching", async () => {
  mockFetch.mockRejectedValueOnce(new Error("Failed to load todos"));

  const { findByRole, findByText } = initiate();

  const errorMessage = await findByText(/Failed to load todos/i);
  const retryButton = await findByRole("button", { name: /retry/i });

  expect(errorMessage).toHaveTextContent(/Failed to load todos/i);
  expect(retryButton).toBeOnTheScreen();
});

//Retry Flow
// First call fails
// Second call succeeds
// Press retry → data appears
test("Retry Fetching", async () => {
  // let resolveFetch: any;
  // let rejectFetch: any;
  // mockFetch.mockImplementation(
  //   () =>
  //     new Promise((resolve, reject) => {
  //       resolveFetch = resolve;
  //       rejectFetch = reject;
  //     }),
  //   );
  mockFetch
    .mockRejectedValueOnce(new Error("Failed to load todos"))
    .mockResolvedValueOnce({ json: async () => MOCK_TODOS });

  const { findByRole, findByText, findByTestId } = initiate();

  // rejectFetch(new Error("Failed to load todos"));
  const errorMessage = await findByText(/Failed to load todos/i);
  const retryButton = await findByRole("button", { name: /retry/i });

  expect(errorMessage).toHaveTextContent(/Failed to load todos/i);
  expect(retryButton).toBeOnTheScreen();

  const user = userEvent.setup();
  await user.press(retryButton);
  // resolveFetch({ json: async () => MOCK_TODOS });

  const todoList = await findByTestId("list");
  expect(todoList).toBeOnTheScreen();
});

// Add Todo
// Type in input
// Press "Add"
// New todo appears in list
test("Add todo", async () => {
  mockFetch.mockResolvedValueOnce({ json: async () => MOCK_TODOS });
  const { findByPlaceholderText, findByRole, findByText } = initiate();

  const todoInput = await findByPlaceholderText(/add todo/i);
  const addTodoBtn = await findByRole("button", { name: /add/i });

  const user = userEvent.setup();

  await user.type(todoInput, "");
  await user.press(addTodoBtn);

  expect(MOCK_TODOS.length).toBe(2);

  await user.type(todoInput, "Zizo wahd bs");
  await user.press(addTodoBtn);

  const newTodo = await findByText("Zizo wahd bs");
  expect(newTodo).toBeOnTheScreen();

  expect(todoInput).toHaveDisplayValue("");
});

// Toggle Todo
// Press a todo
// It becomes completed (✅ appears)
test("toggle Todo", async () => {
  mockFetch.mockResolvedValueOnce({ json: async () => MOCK_TODOS });
  const { findByTestId } = initiate();

  const todoItem = await findByTestId("todo-2");
  const user = userEvent.setup();
  await user.press(todoItem);

  expect(todoItem).toHaveTextContent(/Todo 2 ✅/);
});
