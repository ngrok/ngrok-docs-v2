
import { createContext } from "react";

export type LangSwitcherContextType = {
	selectedLanguage) => void);
};

const LangSwitcherContext = createContext({
	selectedLanguage,
	updateSelectedLanguage,
	defaultLanguage,
});

export default LangSwitcherContext;
