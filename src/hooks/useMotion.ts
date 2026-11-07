import { createContext, useContext } from 'react';

export interface MotionSettings {
  /** Modo de leitura ativado pelo usuário. */
  readingMode: boolean;
  setReadingMode: (on: boolean) => void;
  /** true quando animações devem ser evitadas (modo leitura OU preferência do sistema). */
  reduced: boolean;
}

export const MotionContext = createContext<MotionSettings>({
  readingMode: false,
  setReadingMode: () => {},
  reduced: false,
});

export const useMotion = () => useContext(MotionContext);
