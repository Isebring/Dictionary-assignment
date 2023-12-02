import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, test, vi } from "vitest";
import FavoritesList from "../components/FavoriteList";
import { FavoritesContext } from "../contexts/FavoritesContext";
import Landingpage, { Word } from "../pages/Landingpage";

let favorites: Word[];
const mockRemoveFavorite = vi.fn();
const mockAddFavorite = vi.fn();
const mockIsFavorite = vi.fn((word) => favorites.some((f) => f.word === word));
const mockGetFavorite = vi.fn((word) => favorites.find((f) => f.word === word));
beforeEach(() => {
  favorites = [
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

describe("FavoriteList functionality", () => {
  test("adds a word to favorites when addFavorite is called", async () => {
    // Start by rendering the Landingpage which includes the search functionality
    render(<Landingpage />);
    const user = userEvent.setup();

    const input = screen.getByPlaceholderText("Search for a word..");
    await user.type(input, "test{enter}");

    await screen.findByText("test");

    renderFavoriteList();

    const newFavorite = { word: "test" };
    mockAddFavorite.mockImplementation((word) => {
      favorites.push(word);
    });

    await user.click(screen.getByRole("button", { name: "heart" }));

    expect(mockAddFavorite).toHaveBeenCalledWith(newFavorite);
    expect(favorites).toContain(newFavorite);
  });

  test("removes a word from favorites when removeFavorite is clicked", async () => {
    const user = userEvent.setup();
    renderFavoriteList();
    screen.debug();
    // Simulate clicking remove on the first favorite word
    const removeButtons = screen.getAllByRole("button", { name: "Remove" });
    await user.click(removeButtons[0]);

    const wordToRemove = favorites[0].word;
    mockRemoveFavorite.mockImplementation((word) => {
      favorites = favorites.filter((f) => f.word !== word);
    });

    await user.click(removeButtons[0]);
    expect(mockRemoveFavorite).toHaveBeenCalledWith(wordToRemove);
    expect(favorites).not.toContain(wordToRemove);
  });
});
