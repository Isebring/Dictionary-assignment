import { IconTrash } from "@tabler/icons-react";
import { useContext } from "react";
import { FavoritesContext } from "../contexts/FavoritesContext";
import { SelectedWordContext } from "../contexts/SelectedWordContext";
import { Word } from "../pages/Landingpage";

const FavoritesList: React.FC = () => {
  const { favorites, removeFavorite, getFavorite } =
    useContext(FavoritesContext);
  const { setSelectedWord } = useContext(SelectedWordContext);

  const handleFavoriteClick = (word: string) => {
    const favoriteWord = getFavorite(word);
    if (favoriteWord) {
      setSelectedWord(favoriteWord);
      console.log(favoriteWord);
    }
  };

  return (
    <div className="card">
      <h2>Your Favorite Words</h2>
      {favorites.length > 0 ? (
        favorites.map((favorite: Word, index: number) => (
          <div key={index} style={{ marginTop: "1rem" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "",
              }}
            >
              <p
                style={{
                  alignSelf: "flex-end",
                  fontSize: "1.1rem",
                  cursor: "pointer",
                }}
                onClick={() => handleFavoriteClick(favorite.word)}
              >
                {favorite.word}
              </p>
              <button
                style={{
                  background: "#FF0000",
                  color: "#FFFF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onClick={() => removeFavorite(favorite.word)}
              >
                <IconTrash style={{ marginRight: "0.5rem" }} size={20} />
                Remove
              </button>
            </div>
            <hr className="hr-style" style={{ marginTop: "0.3rem" }} />
          </div>
        ))
      ) : (
        <p>No favorites yet</p>
      )}
    </div>
  );
};

export default FavoritesList;
