import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import ProjectShow from "../pages/ProjectsShow.jsx";

// Mock react-router's useParams to return a fake project ID
vi.mock("react-router-dom", () => ({
  ...vi.importActual("react-router-dom"),
  useParams: () => ({ id: "1" }),
  useNavigate: () => vi.fn(),
}));

// Mock fetch
const mockProjectResponse = {
  id: 1,
  title: "Demo Project",
  tasks: []
};

global.fetch = vi.fn()
  // First call: loadProject()
  .mockResolvedValueOnce({
    json: () => Promise.resolve(mockProjectResponse),
    ok: true
  })
  // Second call: createTask()
  .mockResolvedValueOnce({
    json: () => Promise.resolve({ id: 10, title: "New Task", priority: 0 }),
    ok: true
  });

test("User can add a new task", async () => {
  render(<ProjectShow />);

  const input = await screen.findByPlaceholderText("add new task...");

  fireEvent.change(input, { target: { value: "New Task" } });

  const button = screen.getByText("Add Task");
  fireEvent.click(button);

  // Check that new task appears in UI
  expect(await screen.findByText("New Task")).toBeInTheDocument();
});
