import { render, screen } from "@testing-library/react";
import ProjectsList from "../components/ProjectsList";
import { vi } from "vitest";

test("ProjectsList renders project titles", async () => {
  // Mock fetch response
  global.fetch = vi.fn(() =>
    Promise.resolve({
      json: () =>
        Promise.resolve([
          { id: 1, title: "Test Project A" },
          { id: 2, title: "Test Project B" }
        ])
    })
  );

  render(<ProjectsList onSelectProject={() => {}} />);

  expect(await screen.findByText("Test Project A")).toBeInTheDocument();
  expect(await screen.findByText("Test Project B")).toBeInTheDocument();
});
