import { IconVolume } from "@tabler/icons-react";
import axios from "axios";
import { useEffect, useRef, useState } from "react";

interface Word {
  word: string;
  // phonetic: string;
  phonetics: Array<{
    text: string;
    audio?: string;
  }>;
  origin: string;
  meanings: Array<{
    partOfSpeech: string;
    definitions: Array<{
      definition: string;
      example?: string;
      synonyms?: string[];
      antonyms?: string[];
    }>;
  }>;
}

function Landingpage() {
  const [data, setData] = useState<Word[]>([]);
  const [selectedWord, setSelectedWord] = useState<string>("");
  const [searchedWord, setSearchedWord] = useState<Word | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [activeAudio, setActiveAudio] = useState<string | null>(null);

  const fetchWords = async () => {
    if (selectedWord !== "") {
      try {
        const response = await axios.get(
          `https://api.dictionaryapi.dev/api/v2/entries/en/${selectedWord}`
        );
        setData(response.data);
      } catch (error) {
        console.error(`Error: ${error}`);
      }
    }
  };

  useEffect(() => {
    fetchWords();
  }, [selectedWord]);

  const handleSelect = () => {
    const word = data.find((word) => word.word === selectedWord) || null;
    setSearchedWord(word);
  };

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

  const playAudio = () => {
    if (audioRef.current && activeAudio) {
      audioRef.current.src = activeAudio;
      audioRef.current.load();
      audioRef.current.play();
    }
  };

  return (
    <div>
      <input
        type="search"
        placeholder="Search for a word.."
        value={selectedWord}
        onChange={(e) => setSelectedWord(e.target.value)}
      />
      <button onClick={handleSelect}>Search</button>
      <div>
        {searchedWord && (
          <div>
            <h4>Word:</h4>
            <p>{searchedWord.word}</p>
            {searchedWord.phonetics && searchedWord.phonetics[0] && (
              <div>
                <h4>Phonetics:</h4>
                <p>Text: {searchedWord.phonetics[0].text}</p>
                {activeAudio && (
                  <div>
                    <p>Audio:</p>
                    <audio ref={audioRef} />
                    <source src={activeAudio} type="audio/mpeg" />
                    <IconVolume
                      style={{ cursor: "pointer" }}
                      onClick={playAudio}
                    />
                  </div>
                )}
              </div>
            )}
            {searchedWord.origin && (
              <div>
                <h4>Origin:</h4>
                <p>{searchedWord.origin}</p>
              </div>
            )}
            {searchedWord.meanings && searchedWord.meanings[0] && (
              <div>
                <h4>Part of Speech:</h4>
                <p>{searchedWord.meanings[0].partOfSpeech}</p>
                {searchedWord.meanings[0].definitions &&
                  searchedWord.meanings[0].definitions[0] && (
                    <div>
                      <h4>Definition:</h4>
                      <p>
                        {searchedWord.meanings[0].definitions[0].definition}
                      </p>
                      {searchedWord.meanings[0].definitions[0].example && (
                        <div>
                          <h4>Example:</h4>
                          <p>
                            {searchedWord.meanings[0].definitions[0].example}
                          </p>
                        </div>
                      )}
                      {searchedWord.meanings[0].definitions[0].synonyms &&
                        searchedWord.meanings[0].definitions[0].synonyms
                          .length > 0 && (
                          <div>
                            <h4>Synonyms:</h4>
                            <p>
                              {searchedWord.meanings[0].definitions[0].synonyms.join(
                                ", "
                              )}
                            </p>
                          </div>
                        )}
                      {searchedWord.meanings[0].definitions[0].antonyms &&
                        searchedWord.meanings[0].definitions[0].antonyms
                          .length > 0 && (
                          <div>
                            <h4>Antonyms:</h4>
                            <p>
                              {searchedWord.meanings[0].definitions[0].antonyms.join(
                                ", "
                              )}
                            </p>
                          </div>
                        )}
                    </div>
                  )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Landingpage;
