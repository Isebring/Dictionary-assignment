import { fireEvent, render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import Card from "../components/WordCard";
import { FavoritesContext } from "../contexts/FavoritesContext";
import { Word } from "../pages/Landingpage";

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

let mockIsFavorite = vi.fn();

let mockAddFavorite = vi.fn();

let mockRemoveFavorite = vi.fn();

function renderCard() {
  mockIsFavorite = vi.fn();
  mockAddFavorite = vi.fn();
  mockRemoveFavorite = vi.fn();

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

test("calls addFavorite only once when the Heart icon is clicked", () => {
  mockIsFavorite.mockReturnValue(false);
  renderCard();

  const heartIcon = screen.getByRole("button");
  fireEvent.click(heartIcon);

  expect(mockAddFavorite).toHaveBeenCalledTimes(1);
});

test("does not call addFavorite when the Heart icon is clicked and the word is a favorite", () => {
  mockIsFavorite.mockReturnValue(true);
  renderCard();

  const heartIcon = screen.getByRole("button");
  fireEvent.click(heartIcon);

  expect(mockAddFavorite).not.toHaveBeenCalled();
});

test("adds word to favorites when the Heart icon is clicked", () => {
  mockIsFavorite.mockReturnValue(false);
  renderCard();

  const heartIcon = screen.getByRole("button");
  fireEvent.click(heartIcon);

  expect(mockAddFavorite.mock.calls[0][0]).toEqual(word);
});

test("changes Heart icon color when the Heart icon is clicked and the word is not a favorite", () => {
  mockIsFavorite.mockReturnValue(false);
  renderCard();

  const heartIcon = screen.getByRole("button");
  fireEvent.click(heartIcon);

  expect(heartIcon).toHaveStyle({ fill: "red", stroke: "red" });
});
