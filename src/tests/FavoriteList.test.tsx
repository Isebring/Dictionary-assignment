import { fireEvent, render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import FavoritesContext from "../FavoritesContext";
import FavoritesList from "../components/FavoriteList";

test("renders FavoritesList and removes a favorite", () => {
  const mockRemoveFavorite = vi.fn();
  const mockAddFavorite = vi.fn();
  const mockIsFavorite = vi.fn();
  const favorites = ["word1", "word2", "word3"];

  render(
    <FavoritesContext.Provider
      value={{
        favorites,
        removeFavorite: mockRemoveFavorite,
        addFavorite: mockAddFavorite,
        isFavorite: mockIsFavorite,
      }}
    >
      <FavoritesList />
    </FavoritesContext.Provider>
  );

  favorites.forEach((favorite) => {
    expect(screen.getByText(favorite)).toBeInTheDocument();
  });

  const buttons = screen.getAllByRole("button");
  expect(buttons).toHaveLength(favorites.length);

  fireEvent.click(buttons[0]);

  expect(mockRemoveFavorite).toHaveBeenCalledWith(favorites[0]);
});
