import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, test, vi } from "vitest";
import FavoritesList from "../components/FavoriteList";
import WordCard from "../components/WordCard";
import { FavoritesContext } from "../contexts/FavoritesContext";
import { SelectedWordContext } from "../contexts/SelectedWordContext";
import { Word } from "../pages/Landingpage";

// Define array for storing favorites words
let favorites: Word[];

// Mock functions for managing favorite words
const mockRemoveFavorite = vi.fn();
const mockAddFavorite = vi.fn();
const mockIsFavorite = vi.fn((word) => favorites.some((f) => f.word === word));
const mockGetFavorite = vi.fn((word) => favorites.find((f) => f.word === word));

// Setup initial state for each test
beforeEach(() => {
  favorites = [
    // This is a sample favorite Word object
    {
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
    },
  ];
});

// Define the type for the context of selected word
type SelectedWordContextType = {
  selectedWord: Word | null;
  setSelectedWord: (word: Word | null) => void;
};

// Mock provider for selected word context
const MockSelectedWordProvider: React.FC<{
  value: SelectedWordContextType;
  children?: React.ReactNode;
}> = ({ value, children }) => {
  return (
    <SelectedWordContext.Provider value={value}>
      {children}
    </SelectedWordContext.Provider>
  );
};

// Initial state and mock function for selected word
let selectedWord: Word | null = null;
const mockSetSelectedWord = vi.fn((word: Word | null) => {
  selectedWord = word;
});

// Function to render the FavoritesList component with mocked context
function renderFavoriteListWithWordCard() {
  return render(
    <MockSelectedWordProvider
      value={{ selectedWord, setSelectedWord: mockSetSelectedWord }}
    >
      <FavoritesContext.Provider
        value={{
          favorites,
          removeFavorite: mockRemoveFavorite,
          addFavorite: mockAddFavorite,
          isFavorite: mockIsFavorite,
          getFavorite: mockGetFavorite,
        }}
      >
        <FavoritesList />
        {selectedWord && (
          <WordCard
            word={selectedWord}
            activeAudio={selectedWord?.phonetics[0]?.audio || null}
          />
        )}
      </FavoritesContext.Provider>
    </MockSelectedWordProvider>
  );
}

// These tests are related to the FavoriteList component where the logic for removing a favorite and clicking on a favorite word to rerender it in the card is placed
describe("FavoriteList functionality", () => {
  test("renders selected word in WordCard when a favorite word is clicked", async () => {
    const user = userEvent.setup();
    renderFavoriteListWithWordCard();

    // Simulate clicking on the first favorite word
    const favoriteWords = screen.getAllByText(favorites[0].word);
    await user.click(favoriteWords[0]);

    expect(mockGetFavorite).toHaveBeenCalledWith(favorites[0].word);
    expect(mockSetSelectedWord).toHaveBeenCalledWith(favorites[0]);
    expect(selectedWord).toBe(favorites[0]);
  });

  test("removes a word from favorites when removeFavorite is clicked", async () => {
    const user = userEvent.setup();
    renderFavoriteListWithWordCard();

    // Simulate clicking remove on the first favorite word
    const removeButtons = screen.getAllByRole("button", { name: "Remove" });

    const wordToRemove = favorites[0].word;
    mockRemoveFavorite.mockImplementation((word) => {
      favorites = favorites.filter((f) => f.word !== word);
    });

    await user.click(removeButtons[0]);
    expect(mockRemoveFavorite).toHaveBeenCalledWith(wordToRemove);
    expect(favorites).not.toContain(wordToRemove);
  });
});
