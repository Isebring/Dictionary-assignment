import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import Card from '../components/Card';
import './Landingpage.css';

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
      example?: string;
      synonyms?: string[];
      antonyms?: string[];
    }>;
  }>;
}

function Landingpage() {
  const [data, setData] = useState<Word[]>([]);
  const [selectedWord, setSelectedWord] = useState<string>('');
  const [searchedWord, setSearchedWord] = useState<Word | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [activeAudio, setActiveAudio] = useState<string | null>(null);

  const fetchWords = async () => {
    if (selectedWord !== '') {
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

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSelect();
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
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  return (
    <div className="card">
      <form onSubmit={handleFormSubmit}>
        <input
          className="input-search"
          type="search"
          placeholder="Search for a word.."
          value={selectedWord}
          onChange={(e) => setSelectedWord(e.target.value)}
        />
        <button style={{ height: '3rem' }} onClick={handleSelect}>
          Search
        </button>
        {searchedWord && (
          <Card
            word={searchedWord}
            activeAudio={activeAudio}
            playAudio={playAudio}
          />
        )}
      </form>
    </div>
  );
}

export default Landingpage;
