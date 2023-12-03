import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";
import Card from "../components/WordCard";
import { FavoritesContext } from "../contexts/FavoritesContext";
import { Word } from "../pages/Landingpage";

// Define a sample word for testing
const word: Word = {
  word: "word",
  phonetics: [{ text: "wɜːrd", audio: "https://audio.com/audio1.mp3" }],
  origin: "Old English",
  meanings: [
    {
      partOfSpeech: "noun",
      definitions: [
        {
          definition:
            "A single distinct meaningful element of speech or writing.",
          example: "Words are the basic building blocks of language.",
        },
      ],
      synonyms: ["term", "expression"],
      antonyms: ["silence"],
    },
  ],
  sourceUrls: "http://example.com",
};

// Mock functions for favorite functionality
let mockIsFavorite = vi.fn();
let mockAddFavorite = vi.fn();
let mockRemoveFavorite = vi.fn();

// Helper function to render the Card component with necessary context
function renderCard() {
  mockIsFavorite = vi.fn();
  mockAddFavorite = vi.fn();
  mockRemoveFavorite = vi.fn();

  // Render Card component with provided context
  return render(
    <FavoritesContext.Provider
      value={{
        favorites: [],
        addFavorite: mockAddFavorite,
        removeFavorite: mockRemoveFavorite,
        isFavorite: mockIsFavorite,
        getFavorite: vi.fn(),
      }}
    >
      <Card word={word} activeAudio={null} />
    </FavoritesContext.Provider>
  );
}

test("calls addFavorite only once when the Heart icon is clicked", async () => {
  mockIsFavorite.mockReturnValue(false);
  renderCard();

  const heartIcon = screen.getByRole("button", { name: "heart" });
  userEvent.click(heartIcon);

  await waitFor(() => {
    expect(mockAddFavorite).toHaveBeenCalledTimes(1);
  });
});

test("does not call addFavorite when the Heart icon is clicked and the word is a favorite", () => {
  // Setup mock function to return true (word is a favorite)
  mockIsFavorite.mockReturnValue(true);
  renderCard();

  const heartIcon = screen.getByRole("button", { name: "heart" });
  userEvent.click(heartIcon);

  // Verify that addFavorite was not called
  expect(mockAddFavorite).not.toHaveBeenCalled();
});

test("adds word to favorites when the Heart icon is clicked", async () => {
  // Setup mock function to return false (word is not a favorite)
  mockIsFavorite.mockReturnValue(false);
  renderCard();

  const heartIcon = screen.getByRole("button", { name: "heart" });
  userEvent.click(heartIcon);

  // Wait for any asynchronous actions to complete
  await waitFor(() => {
    // Verify that the correct word was passed to addFavorite
    expect(mockAddFavorite.mock.calls[0][0]).toEqual(word);
  });
});
