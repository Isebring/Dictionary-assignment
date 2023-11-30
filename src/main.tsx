import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { FavoritesProvider } from "./contexts/FavoritesContext";
import { SelectedWordProvider } from "./contexts/SelectedWordContext";
import "./main.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <FavoritesProvider>
      <SelectedWordProvider>
        <App />
      </SelectedWordProvider>
    </FavoritesProvider>
  </React.StrictMode>
);
