import {
	type Meta,
	type SupportedLanguage,
	parseLanguage,
} from "@ngrok/mantle/code-block";

import { type LanguageInfo, languageInfo } from "./data";
export function getMetaDataWithQuotes(
	propertyName,
	metastring,
) {
	const property = `${propertyName}=`;
	if (!metastring.includes(property)) return null;
	// Get the substring starting with tabName= and ending with
	// a closing quote and a space
	const tabNameSubstring = metastring.split(property)[1] ?? "";
	// If the first character is not a quote, we shouldn't parse this property
	if (tabNameSubstring[0] !== '"') return null;
	const lastQuoteIndex = tabNameSubstring.indexOf(`" `);
	const tabNameValueEnd =
		lastQuoteIndex > 0 ? lastQuoteIndex : tabNameSubstring.length - 1;
	return tabNameSubstring.substring(1, tabNameValueEnd);
}

// The properties that take string values, e.g. tabName="foo bar"
// rather than non-string values, e.g. tabName=foo
const stringMetaProperties = ["tabName", "title"];

export function getMetaData(metastring) {
	if (!metastring) {
		return {};
	}
	const meta = metastring.split(/\s+/);
	const metaData, string> = {};
	// biome-ignore lint/complexity/noForEach) => {
		const [key, value] = item.split("=");
		if (key && value) {
			metaData[key] = value.replace(/['"]/g, ""); // Remove " characters
		}
	});
	// Add the properties that use quotes to the metaData object
	// biome-ignore lint/complexity/noForEach) => {
		const quotedData = getMetaDataWithQuotes(property, metastring);
		if (quotedData) {
			metaData[property] = quotedData;
		}
	});
	return metaData;
}

export type CodeBlockData = {
	language= (children){
	return children.map((child) => {
		const { className, metastring, children, language } =
			child?.props.children.props ?? child.props;

		const parsedLanguage = language || parseLanguage(className);
		const meta = getMetaData(metastring);
		const title = meta.title || child.props.title;
		return {
			language,
			content,
			meta,
				collapsible,
				titleLink,
				tabName,
				title,
				disableCopy,
			},
			info),
		};
	});
};

export const getLanguageInfo = (language) => {
	if (!language) return null;
	const foundLang = languageInfo.find(
		(item) => item.name === language || item?.allNames?.includes(language),
	);

	if (!foundLang) {
		console.error("Language not valid for codeblocks, language);
		// If can't find it, return `bash`
		return languageInfo[0];
	}
	return foundLang;
};

export function languagesAreSynonyms(
	languageToCheck,
	selectedLanguage,
) {
	if (!selectedLanguage) return false;
	const synonymousLanguage = languageInfo.find((lang) =>
		lang.allNames?.includes(selectedLanguage),
	);
	return (
		synonymousLanguage?.name === languageToCheck ||
		synonymousLanguage?.allNames?.includes(languageToCheck)
	);
}

// The name of the query param or localstorage item to search for
// to get the default language switcher value
export const langParamName = "defaultTabLang";

export const getStorageLanguage = () => {
	return localStorage.getItem(langParamName);
};

export const tabParamName = "defaultTabItem";
export const getStorageTab = (tabGroupId?: string) => {
	let tabItem= undefined;

	if (localStorage) {
		const unParsedTabItem = localStorage.getItem(tabGroupId || tabParamName);
		try {
			if (unParsedTabItem) {
				return JSON.parse(unParsedTabItem);
			}
			tabItem = {
				item) || "",
				groupId,
			};
		} catch (error) {
			console.error("Error parsing data for tabs and lang switcher, error);
		}
	}

	return tabItem;
};
