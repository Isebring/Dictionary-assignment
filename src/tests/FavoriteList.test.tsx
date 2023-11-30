import { fireEvent, render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import FavoritesList from "../components/FavoriteList";
import { FavoritesContext } from "../contexts/FavoritesContext";
import { Word } from "../pages/Landingpage";

const mockRemoveFavorite = vi.fn();
const mockAddFavorite = vi.fn();
const mockIsFavorite = vi.fn();
const mockGetFavorite = vi.fn();
const favorites: Word[] = [
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

function renderFavoriteList() {
  return render(
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
    </FavoritesContext.Provider>
  );
}

test("renders favorite words correctly", () => {
  renderFavoriteList();

  favorites.forEach((favorite) => {
    expect(screen.getByText(favorite.word)).toBeInTheDocument();
  });
});

test("renders correct number of buttons", () => {
  renderFavoriteList();

  const buttons = screen.getAllByRole("button");
  expect(buttons).toHaveLength(favorites.length);
});

test("calls removeFavorite when button is clicked", () => {
  renderFavoriteList();

  const buttons = screen.getAllByRole("button");
  fireEvent.click(buttons[0]);

  expect(mockRemoveFavorite).toHaveBeenCalledWith(favorites[0].word);
});

test("removes word from document when button is clicked", async () => {
  renderFavoriteList();

  const buttons = screen.getAllByRole("button");
  fireEvent.click(buttons[0]);

  expect(mockRemoveFavorite).toHaveBeenCalledWith(favorites[0].word);
});
