import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "../App";

// Check so that the page starts in light mode and correctly shifts between light and dark when the user clicks.

describe("Dark Mode toggle", () => {
  it("starts in light mode and toggles between light and dark mode", () => {
    render(<App />);

    const toggleButton = screen.getByRole("button");
    const appDiv = document.querySelector(".App");

    expect(toggleButton).toHaveTextContent("Light");
    expect(appDiv).toHaveClass("light");
    expect(document.documentElement).not.toHaveClass("dark");

    fireEvent.click(toggleButton);

    expect(toggleButton).toHaveTextContent("Dark");
    expect(appDiv).toHaveClass("dark");
    expect(document.documentElement).toHaveClass("dark");

    fireEvent.click(toggleButton);

    expect(toggleButton).toHaveTextContent("Light");
    expect(appDiv).toHaveClass("light");
    expect(document.documentElement).not.toHaveClass("dark");
  });
});
