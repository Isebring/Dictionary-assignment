import { FC, ReactNode, createContext, useState } from "react";
import { Word } from "../pages/Landingpage";

interface FavoritesContextType {
  favorites: Word[];
  addFavorite: (word: Word) => void;
  removeFavorite: (word: string) => void;
  isFavorite: (word: string) => boolean;
  getFavorite: (word: string) => Word | undefined;
}

export const FavoritesContext = createContext<FavoritesContextType>({
  favorites: [],
  addFavorite: () => {},
  removeFavorite: () => {},
  isFavorite: () => false,
  getFavorite: () => undefined,
});

interface FavoritesProviderProps {
  children: ReactNode;
}

export const FavoritesProvider: FC<FavoritesProviderProps> = ({ children }) => {
  const getFavorites = () => {
    const savedFavorites = sessionStorage.getItem("favorites");
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  };

  const [favorites, setFavorites] = useState<Word[]>(getFavorites());

  const addFavorite = (word: Word) => {
    const newFavorites = [...favorites, word];
    setFavorites(newFavorites);
    sessionStorage.setItem("favorites", JSON.stringify(newFavorites));
    setFavorites(getFavorites());
  };

  const removeFavorite = (word: string) => {
    const newFavorites = favorites.filter(
      (favorite: Word) => favorite.word !== word
    );
    setFavorites(newFavorites);
    sessionStorage.setItem("favorites", JSON.stringify(newFavorites));
  };

  const isFavorite = (word: string) =>
    favorites.some((favorite: Word) => favorite.word === word);

  const getFavorite = (word: string) =>
    favorites.find((favorite: Word) => favorite.word === word);

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addFavorite,
        removeFavorite,
        isFavorite,
        getFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};
