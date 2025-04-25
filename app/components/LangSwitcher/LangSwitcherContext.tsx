import type { SupportedLanguage } from "@ngrok/mantle/code-block";
import { createContext } from "react";

export type LangSwitcherContextType = {
  selectedLanguage: string | SupportedLanguage | null;
  localStorageLanguage: string | null;
  updateSelectedLanguage:
    | null
    | ((newLang: string | SupportedLanguage | undefined) => void);
};

const LangSwitcherContext = createContext<LangSwitcherContextType | null>(null);

export default LangSwitcherContext;
