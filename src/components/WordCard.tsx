import { IconHeart, IconVolume } from "@tabler/icons-react";
import React, { useContext, useEffect, useRef } from "react";
import { FavoritesContext } from "../contexts/FavoritesContext";
import { Word } from "../pages/Landingpage";

interface WordCardProps {
  word: Word;
  activeAudio: string | null;
  playAudio?: () => void;
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
      addFavorite(word);
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <IconHeart
            role="button"
            aria-label="heart"
            fill={isFavorite(word.word) ? "red" : "none"}
            stroke={isFavorite(word.word) ? "red" : "black"}
            onClick={toggleFavorite}
          />
          <h2 style={{ marginLeft: "1rem" }}>{word.word}</h2>
        </div>

        {word.phonetics && (
          <div>
            {activeAudio && (
              <div style={{ marginTop: "3.1rem" }}>
                <audio role="audio" ref={audioRef} />
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
        word.meanings.map((meaning, index) => {
          let definitionCounter = 0;
          return (
            <div key={index}>
              <hr
                style={{ marginTop: "0.5rem", marginBottom: "0.5rem" }}
                className="hr-style"
              />
              <p
                style={{
                  fontStyle: "italic",
                  fontSize: "1.1rem",
                  marginBottom: "1rem",
                }}
              >
                {meaning.partOfSpeech}
              </p>
              {meaning.definitions &&
                meaning.definitions.map((definition, defIndex) => {
                  if (definitionCounter >= 5) return null;
                  definitionCounter++;
                  return (
                    <div key={defIndex}>
                      <h4>Definition:</h4>
                      <p>{definition.definition}</p>
                      {definition.example && (
                        <div>
                          <h4>Example:</h4>
                          <p>{definition.example}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              {meaning.synonyms && meaning.synonyms.length > 0 && (
                <div>
                  <h4>Synonyms:</h4>
                  <p>
                    {meaning.synonyms.slice(0, 5).join(", ")}
                    {meaning.synonyms.length > 6 && ",..."}
                  </p>
                </div>
              )}
              {meaning.antonyms && meaning.antonyms.length > 0 && (
                <div>
                  <h4>Antonyms:</h4>
                  <p>
                    {meaning.antonyms.slice(0, 5).join(", ")}
                    {meaning.antonyms.length > 6 && ",..."}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      <hr
        style={{ marginTop: "0.5rem", marginBottom: "0.5rem" }}
        className="hr-style"
      />
      {word.sourceUrls && (
        <div style={{ marginTop: "1rem" }}>
          <h4>Source:</h4>
          <a
            href={word.sourceUrls}
            target="_blank"
            rel="noopener noreferrer"
            className="sourceLink"
          >
            {word.sourceUrls}
          </a>
        </div>
      )}
    </div>
  );
};

export default Card;
