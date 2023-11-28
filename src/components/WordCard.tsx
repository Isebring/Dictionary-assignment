import { IconHeart, IconVolume } from "@tabler/icons-react";
import React, { useContext, useEffect, useRef } from "react";
import FavoritesContext from "../FavoritesContext";
import { Word } from "../pages/Landingpage";

interface WordCardProps {
  word: Word;
  activeAudio: string | null;
  playAudio: () => void;
}

const Card: React.FC<WordCardProps> = ({ word, activeAudio }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current && activeAudio) {
      audioRef.current.src = activeAudio;
      audioRef.current.load();
    }
  }, [activeAudio]);

  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  const favoritesContext = useContext(FavoritesContext);

  const { addFavorite, removeFavorite, isFavorite } = favoritesContext;

  const toggleFavorite = () => {
    if (isFavorite(word.word)) {
      removeFavorite(word.word);
    } else {
      addFavorite(word.word);
    }
  };

  return (
    <div>
      <IconHeart
        style={{ marginTop: "1rem" }}
        fill={isFavorite(word.word) ? "red" : "none"}
        stroke={isFavorite(word.word) ? "red" : "black"}
        onClick={toggleFavorite}
      />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>{word.word}</h2>
        {word.phonetics && (
          <div>
            {activeAudio && (
              <div>
                <audio ref={audioRef} />
                <source src={activeAudio} type="audio/mpeg" />
                <IconVolume style={{ cursor: "pointer" }} onClick={playAudio} />
              </div>
            )}
            {word.phonetics.slice(0, 5).map((phonetic, index) => (
              <div key={index}>
                <p>{phonetic.text}</p>
              </div>
            ))}
            {word.phonetics.length > 5 && "..."}
          </div>
        )}
      </div>
      {word.origin && (
        <div>
          <h4>Origin:</h4>
          <p>{word.origin}</p>
        </div>
      )}
      {word.meanings &&
        word.meanings.slice(0, 5).map((meaning, index) => (
          <div key={index}>
            <p>{meaning.partOfSpeech}</p>
            {meaning.definitions &&
              meaning.definitions.slice(0, 5).map((definition, defIndex) => (
                <div key={defIndex}>
                  <h4>Definition:</h4>
                  <p>{definition.definition}</p>
                  {definition.example && (
                    <div>
                      <h4>Example:</h4>
                      <p>{definition.example}</p>
                    </div>
                  )}
                  {definition.synonyms && definition.synonyms.length > 0 && (
                    <div>
                      <h4>Synonyms:</h4>
                      <p>
                        {definition.synonyms.slice(0, 5).join(", ")}
                        {definition.synonyms.length > 5 && ",..."}
                      </p>
                    </div>
                  )}
                  {definition.antonyms && definition.antonyms.length > 0 && (
                    <div>
                      <h4>Antonyms:</h4>
                      <p>
                        {definition.antonyms.slice(0, 5).join(", ")}
                        {definition.antonyms.length > 5 && ",..."}
                      </p>
                    </div>
                  )}
                </div>
              ))}
          </div>
        ))}
    </div>
  );
};

export default Card;
