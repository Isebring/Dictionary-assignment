import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  it,
  test,
  vi,
} from "vitest";
import App from "../App";
import Header from "../components/Header";
import * as Navigator from "../navigator";
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

// Mocking the navigator to test that clicking "My Dictionary" returns the user to "/"
vi.mock("../navigator", () => ({
  navigate: vi.fn(),
}));

const navigate = Navigator.navigate;

describe("Header", () => {
  it("changes window location when 'My Dictionary' is clicked", async () => {
    render(<Header />);

    const heading = screen.getByRole("heading", { name: /my dictionary/i });
    userEvent.click(heading);

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith("/");
    });
  });
});

// Check so that the page starts in light mode and correctly shifts between light and dark when the user clicks.
describe("Dark Mode toggle", () => {
  it("starts in light mode and toggles between light and dark mode", async () => {
    render(<App />);

    let toggleButton = screen.getByRole("button", { name: /Dark/i });
    const appDiv = document.querySelector(".App");

    expect(toggleButton).toHaveTextContent("Dark");
    expect(appDiv).toHaveClass("light");
    expect(document.documentElement).not.toHaveClass("dark");

    userEvent.click(toggleButton);

    toggleButton = await screen.findByRole("button", { name: /Light/i });

    expect(toggleButton).toHaveTextContent("Light");
    expect(appDiv).toHaveClass("dark");
    expect(document.documentElement).toHaveClass("dark");

    userEvent.click(toggleButton);

    toggleButton = await screen.findByRole("button", { name: /Dark/i });

    expect(toggleButton).toHaveTextContent("Dark");
    expect(appDiv).toHaveClass("light");
    expect(document.documentElement).not.toHaveClass("dark");
  });
});

// Checks that the validation works depending on user input
describe("Landingpage component", () => {
  test("renders error message correctly", async () => {
    render(<Landingpage />);

    const inputField = screen.getByPlaceholderText("Search for a word..");
    const button = screen.getByText("Search");

    // Uses button to submit
    userEvent.click(button);
    let errorMessage = await screen.findByText("Please enter a word!");
    expect(errorMessage).toBeInTheDocument();

    // Uses enter to submit
    userEvent.type(inputField, "hello@world{enter}");
    errorMessage = await screen.findByText(
      "Input contains special characters!"
    );
    expect(errorMessage).toBeInTheDocument();
  });

  // Checks so that the validation works if user tries to submit an empty input or use special characters
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

// Here I use the MSWJS to intercept the regular API call when testing that the API returns the expected data

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("Landingpage component", () => {
  it("fetches and displays word data when a valid word is searched", async () => {
    const user = userEvent.setup();
    render(<Landingpage />);
    const inputField = screen.getByPlaceholderText("Search for a word..");

    await user.type(inputField, "test");

    const searchButton = screen.getByRole("button", { name: "Search" });
    await user.click(searchButton);

    const heading = await screen.findByRole("heading", { name: "test" });
    expect(heading).toBeInTheDocument();

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

    const link = await screen.findByRole("link", { name: /Test link/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "https://sourceUrl.com/test");
  });

  // if the user searches for a word that is not available they should be notified

  it("displays an error message when a word is not found", async () => {
    const user = userEvent.setup();
    render(<Landingpage />);

    const inputField = screen.getByPlaceholderText("Search for a word..");
    await user.type(inputField, "invalidword");

    const searchButton = screen.getByRole("button", { name: "Search" });
    await user.click(searchButton);

    const errorMessage = await screen.findByText("Word not found!");
    expect(errorMessage).toBeInTheDocument();
  });
});
