import axios from "axios";
import { useContext, useEffect, useRef, useState } from "react";
import FavoritesList from "../components/FavoriteList";
import Card from "../components/WordCard";
import { SelectedWordContext } from "../contexts/SelectedWordContext";
import { validateInput } from "../validatedInput";
import "./Landingpage.css";

export interface Word {
  word: string;
  phonetics: Array<{
    text: string;
    audio?: string;
  }>;
  origin: string;
  meanings: Array<{
    partOfSpeech: string;
    definitions: Array<{
      definition: string;
      example: string;
    }>;
    synonyms: string[];
    antonyms: string[];
  }>;
  sourceUrls: string;
}

function Landingpage() {
  const [data, setData] = useState<Word[]>([]);
  const [selectedWord, setSelectedWord] = useState<string>("");
  const [searchedWord, setSearchedWord] = useState<Word | null>(null);
  const [errorMessage, setErrorMessage] = useState<Record<
    string,
    string
  > | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [activeAudio, setActiveAudio] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { selectedWord: favoriteWord, setSelectedWord: setFavoriteWord } =
    useContext(SelectedWordContext);

  // Function to fetch words from the API
  const fetchWords = async () => {
    if (selectedWord !== "") {
      try {
        const response = await axios.get(
          `https://api.dictionaryapi.dev/api/v2/entries/en/${selectedWord}`
        );
        console.log(response);
        setData(response.data);
        const word =
          response.data.find((word: Word) => word.word === selectedWord) ||
          null;
        setSearchedWord(word);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          setErrorMessage({ notFound: "Word not found!" });
        } else {
          console.error(`Error: ${error}`);
        }
      }
    }
  };

  // Fetch words when isSubmitted changes
  useEffect(() => {
    if (isSubmitted) {
      fetchWords();
    }
  }, [isSubmitted]);

  // Function to handle the selection of a word
  const handleSelect = () => {
    setFavoriteWord(null);
    setErrorMessage(null);
    const errors = validateInput(selectedWord);
    console.log(errors);
    if (Object.keys(errors).length > 0) {
      setErrorMessage(errors);
      return;
    }
    setIsSubmitted(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSelect();
  };

  // Update activeAudio when searchedWord changes
  useEffect(() => {
    if (searchedWord) {
      const audioPhonetic = searchedWord.phonetics.find(
        (phonetic) => phonetic.audio
      );
      if (audioPhonetic) {
        setActiveAudio(audioPhonetic.audio!);
      }
    }
  }, [searchedWord]);

  // Update activeAudio when favoriteWord changes
  useEffect(() => {
    if (favoriteWord) {
      const audioPhonetic = favoriteWord.phonetics.find(
        (phonetic) => phonetic.audio
      );
      if (audioPhonetic) {
        setActiveAudio(audioPhonetic.audio!);
      }
    }
  }, [favoriteWord]);

  // Function to play the audio
  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  // Determine which word to render
  const wordToRender: Word | null = favoriteWord || searchedWord;

  return (
    <>
      <div className="card">
        <form onSubmit={handleFormSubmit}>
          <div className="search-container">
            <input
              className="input-search"
              type="search"
              placeholder="Search for a word.."
              value={selectedWord}
              onChange={(e) => {
                setSelectedWord(e.target.value);
                if (e.target.value.trim() === "" || errorMessage) {
                  setErrorMessage(null);
                  setIsSubmitted(false);
                }
              }}
            />
            <button style={{ height: "3rem", marginLeft: "1rem" }}>
              Search
            </button>
          </div>
          <div className="error-messages">
            {errorMessage &&
              Object.entries(errorMessage).map(([key, value]) => (
                <div key={key}>
                  <p
                    style={{
                      color: "red",
                      justifyContent: "center",
                      whiteSpace: "pre",
                    }}
                  >
                    {value}
                  </p>
                </div>
              ))}
          </div>
          {wordToRender && (
            <Card
              word={wordToRender}
              activeAudio={activeAudio}
              playAudio={playAudio}
            />
          )}
        </form>
      </div>
      <FavoritesList />
    </>
  );
}

export default Landingpage;
