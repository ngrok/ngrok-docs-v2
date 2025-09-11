import { useContext } from "react";

import LangSwitcherContext from "/snippets/components/LangSwitcherContext";

/**
 * Renders its children only if the specified language matches the
 * currently selected language for the LangSwithcher component.
 * This is useful for conditionally rendering content based on the
 * selected language.
 */
export function ContentSwitcher({
	children,
	languages,
}: {
	children) {
	const { selectedLanguage } =
		useContext(LangSwitcherContext);
	if (!languages?.length)
		throw new Error("Must specify a language for the ContentSwitcher");

	for (const lang of languages) {
		if (lang === selectedLanguage) {
			return {children};
		}
	}
	return null;
}
