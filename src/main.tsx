import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./main.css";
import { FavoritesProvider } from "./FavoritesContext";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <FavoritesProvider>
      <App />
    </FavoritesProvider>
  </React.StrictMode>
);
