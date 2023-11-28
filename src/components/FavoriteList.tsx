import { IconTrash } from "@tabler/icons-react";
import React, { useContext } from "react";
import FavoritesContext from "../FavoritesContext";

const FavoritesList: React.FC = () => {
  const favoritesContext = useContext(FavoritesContext);
  const { favorites, removeFavorite } = favoritesContext;
  return (
    <div className="card">
      <h2>Your Favorite Words</h2>
      {favorites.length > 0 ? (
        favorites.map((favorite: string, index: number) => (
          <div key={index} style={{ marginTop: "1rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              {favorite}
              <IconTrash fill="red" onClick={() => removeFavorite(favorite)} />
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
