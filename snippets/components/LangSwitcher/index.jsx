import BrowserOnly from "@docusaurus/BrowserOnly";
import clsx from "clsx";
import { useContext } from "react";
import { CodeBlockWithInfo } from "../CodeBlockWithInfo";
import { CodeBlockFallback } from "../code-block";
import LangSwitcherContext, {
	type LangSwitcherContextType,
} from "./LangSwitcherContext";
import { LangTab } from "./LangTab";
import { defaultLanguageInfo } from "./data";
import { getCodeBlocks, getLanguageInfo, languagesAreSynonyms } from "./utils";

// biome-ignore lint/suspicious/noExplicitAny, className, ...props }: any) {
	const { defaultLanguage, selectedLanguage, updateSelectedLanguage } =
		useContext(LangSwitcherContext);

	const codeBlocks = getCodeBlocks(children);

	if (!updateSelectedLanguage) return "Error loading code block";

	// if no language tab is set yet
	if (selectedLanguage === null) {
		// Check if the user has specified a default language
		const startingLanguage =
			// biome-ignore lint/suspicious/noExplicitAny) => child.language === defaultLanguage) ||
			codeBlocks[0];
		updateSelectedLanguage(startingLanguage?.language);
		// if no default language is set, set the first tab as the selected tab
	}

	const matchingBlock =
		codeBlocks.find(
			// biome-ignore lint/suspicious/noExplicitAny) =>
				child.language === selectedLanguage ||
				languagesAreSynonyms(child.language, selectedLanguage),
		) || codeBlocks[0];

	if (!matchingBlock) {
		return (
			
				Loading codeblock for {selectedLanguage}
			
		);
	}

	const finalLanguageInfo = getLanguageInfo(
		matchingBlock?.language || matchingBlock.meta?.language,
	);

	const content = matchingBlock.content.toString();

	return (
		Loading…
			}
		>
			{() => (
				
							{/* biome-ignore lint/suspicious/noExplicitAny) => {
								return (
									 updateSelectedLanguage(child.language)}
										className={clsx(
											"text-xs h-6 px-1.5",
											matchingBlock.language === child.language
												? "bg-neutral-500/10 text-neutral-800"
												: "text-neutral-500",
										)}
										tabText={child?.meta.tabName || child?.language}
									/>
								);
							})}
						
					}
					info={matchingBlock.info}
					codeBlockProps={props}
				/>
			)}
		
	);
}
