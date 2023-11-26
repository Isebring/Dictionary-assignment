import { IconVolume } from '@tabler/icons-react';
import React, { useEffect, useRef } from 'react';
import { Word } from '../pages/Landingpage';

interface CardProps {
  word: Word;
  activeAudio: string | null;
  playAudio: () => void;
}

const Card: React.FC<CardProps> = ({ word, activeAudio }) => {
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

  return (
    <div>
      {/* <h4>Word:</h4> */}
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h2>{word.word}</h2>
        {word.phonetics && word.phonetics[0] && (
          <div>
            {activeAudio && (
              <div>
                {/* <p>Audio:</p> */}
                <audio ref={audioRef} />
                <source src={activeAudio} type="audio/mpeg" />
                <IconVolume style={{ cursor: 'pointer' }} onClick={playAudio} />
              </div>
            )}
            {/* <h4>Phonetics:</h4> */}
            <p>{word.phonetics[0].text}</p>
          </div>
        )}
      </div>
      {word.origin && (
        <div>
          <h4>Origin:</h4>
          <p>{word.origin}</p>
        </div>
      )}
      {word.meanings && word.meanings[0] && (
        <div>
          {/* <h4>Part of Speech:</h4> */}
          <p>{word.meanings[0].partOfSpeech}</p>
          {word.meanings[0].definitions && word.meanings[0].definitions[0] && (
            <div>
              <h4>Definition:</h4>
              <p>{word.meanings[0].definitions[0].definition}</p>
              {word.meanings[0].definitions[0].example && (
                <div>
                  <h4>Example:</h4>
                  <p>{word.meanings[0].definitions[0].example}</p>
                </div>
              )}
              {word.meanings[0].definitions[0].synonyms &&
                word.meanings[0].definitions[0].synonyms.length > 0 && (
                  <div>
                    <h4>Synonyms:</h4>
                    <p>{word.meanings[0].definitions[0].synonyms.join(', ')}</p>
                  </div>
                )}
              {word.meanings[0].definitions[0].antonyms &&
                word.meanings[0].definitions[0].antonyms.length > 0 && (
                  <div>
                    <h4>Antonyms:</h4>
                    <p>{word.meanings[0].definitions[0].antonyms.join(', ')}</p>
                  </div>
                )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Card;
