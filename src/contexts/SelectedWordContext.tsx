import { FC, ReactNode, createContext, useState } from "react";
import { Word } from "../pages/Landingpage";

interface SelectedWordContextType {
  selectedWord: Word | null;
  setSelectedWord: (word: Word | null) => void;
}

export const SelectedWordContext = createContext<SelectedWordContextType>({
  selectedWord: null,
  setSelectedWord: () => {},
});

interface SelectedWordProviderProps {
  children: ReactNode;
}

export const SelectedWordProvider: FC<SelectedWordProviderProps> = ({
  children,
}) => {
  const [selectedWord, setSelectedWord] = useState<Word | null>(null);
  return (
    <SelectedWordContext.Provider
      value={{
        selectedWord,
        setSelectedWord,
      }}
    >
      {children}
    </SelectedWordContext.Provider>
  );
};
