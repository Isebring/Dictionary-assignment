import { fireEvent, render, screen } from "@testing-library/react";
import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  it,
  test,
} from "vitest";
import App from "../App";
import Landingpage from "../pages/Landingpage";
import { server } from "../server";
import { validateInput } from "../validatedInput";

// Check so that the <h1> renders correctly
test("renders h1 tag correctly", () => {
  render(<App />);

  const h1Element = screen.getByRole("heading", { level: 1 });
  expect(h1Element).toBeInTheDocument();
  expect(h1Element.textContent).toBe("My Dictionary.");
});

// Check so that the page starts in light mode and correctly shifts between light and dark when the user clicks.
describe("Dark Mode toggle", () => {
  it("starts in light mode and toggles between light and dark mode", () => {
    render(<App />);

    const toggleButton = screen.getByRole("button", { name: /Light/i });
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

  // Checks that the validation works depending on user input
  describe("Landingpage component", () => {
    test("renders error message correctly", async () => {
      render(<Landingpage />);

      const inputField = screen.getByPlaceholderText("Search for a word..");
      const button = screen.getByText("Search");

      fireEvent.click(button);
      let errorMessage = await screen.findByText("Please enter a word!");
      expect(errorMessage).toBeInTheDocument();

      fireEvent.change(inputField, { target: { value: "hello@world" } });
      fireEvent.click(button);
      errorMessage = await screen.findByText(
        "Input contains special characters!"
      );
      expect(errorMessage).toBeInTheDocument();
    });

    test("validates input correctly", () => {
      const emptyInput = "";
      const inputWithSpecialChar = "hello@world";
      const validInput = "hello world";

      let result = validateInput(emptyInput);
      expect(result).toEqual({ empty: "Please enter a word!" });

      result = validateInput(inputWithSpecialChar);
      expect(result).toEqual({
        specialChars: "Input contains special characters!",
      });

      result = validateInput(validInput);
      expect(result).toEqual({});
    });
  });

  // Using the mock server from mswjs here to check that everything from the API renders correctly

  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  describe("Landingpage component", () => {
    it("fetches and displays word data when a valid word is searched", async () => {
      render(<Landingpage />);
      const inputField = screen.getByPlaceholderText("Search for a word..");
      const searchButton = screen.getByRole("button", { name: /search/i });

      fireEvent.change(inputField, { target: { value: "test" } });
      fireEvent.click(searchButton);

      expect(
        await screen.findByRole("heading", { name: /test/i })
      ).toBeInTheDocument();

      expect(await screen.findByRole("audio")).toBeInTheDocument();

      const phoneticItems = await screen.findAllByText(/\/.*\//);
      expect(phoneticItems).not.toHaveLength(0);

      const partOfSpeechItems = await screen.findAllByText(
        /noun|verb|adjective|adverb|pronoun|preposition|conjunction|interjection|article/
      );
      expect(partOfSpeechItems).not.toHaveLength(0);

      const definitionItems = await screen.findAllByText(/Definition:/);
      expect(definitionItems).not.toHaveLength(0);

      const exampleItems = await screen.findAllByText(/Example:/);
      expect(exampleItems).not.toHaveLength(0);

      const synonymItems = await screen.findAllByText(/Synonyms:/);
      expect(synonymItems).not.toHaveLength(0);

      const antonymItems = await screen.findAllByText(/Antonyms:/);
      expect(antonymItems).not.toHaveLength(0);

      const originItem = await screen.findByText(/Origin:/);
      expect(originItem).toBeInTheDocument();
    });

    it("displays an error message when a word is not found", async () => {
      render(<Landingpage />);
      const inputField = screen.getByPlaceholderText("Search for a word..");
      const searchButton = screen.getByText("Search");

      fireEvent.change(inputField, { target: { value: "invalidword" } });
      fireEvent.click(searchButton);
      screen.debug();
      await screen.findByText("Word not found!");

      expect(screen.getByText("Word not found!")).toBeInTheDocument();
    });
  });
});
