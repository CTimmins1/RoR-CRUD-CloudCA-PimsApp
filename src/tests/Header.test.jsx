import { render, screen } from "@testing-library/react";
import Header from "../components/Header";

test("Header displays the app title", () => {
  render(<Header />);

  expect(screen.getByText("PIMS Dashboard")).toBeInTheDocument();
});
