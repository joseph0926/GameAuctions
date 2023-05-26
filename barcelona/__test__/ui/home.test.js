import { render, screen } from "@testing-library/react";
import HomePage from "@/pages/index.js";

test("HomePage UI Test", () => {
  render(<HomePage />);

  const heading = screen.getByRole("heading", { hidden: true, name: "Test Text" });
  expect(heading).toBeInTheDocument();
});
