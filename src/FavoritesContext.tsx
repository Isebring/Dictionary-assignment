import { FC, ReactNode, createContext, useState } from "react";

interface FavoritesContextType {
  favorites: string[];
  addFavorite: (word: string) => void;
  removeFavorite: (word: string) => void;
  isFavorite: (word: string) => boolean;
}

interface FavoritesProviderProps {
  children: ReactNode;
}

const FavoritesContext = createContext<FavoritesContextType>({
  favorites: [],
  addFavorite: () => {},
  removeFavorite: () => {},
  isFavorite: () => false,
});

export const FavoritesProvider: FC<FavoritesProviderProps> = ({ children }) => {
  const getFavorites = () => {
    const savedFavorites = sessionStorage.getItem("favorites");
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  };

  const [favorites, setFavorites] = useState(getFavorites());

  const addFavorite = (word: string) => {
    const newFavorites = [...favorites, word];
    setFavorites(newFavorites);
    sessionStorage.setItem("favorites", JSON.stringify(newFavorites));
    setFavorites(getFavorites());
  };

  const removeFavorite = (word: string) => {
    const newFavorites = favorites.filter(
      (favorite: string) => favorite !== word
    );
    setFavorites(newFavorites);
    sessionStorage.setItem("favorites", JSON.stringify(newFavorites));
    setFavorites(getFavorites());
  };

  const isFavorite = (word: string) => favorites.includes(word);

  return (
    <FavoritesContext.Provider
      value={{ favorites, addFavorite, removeFavorite, isFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export default FavoritesContext;
