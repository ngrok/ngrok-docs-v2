
import { CodeBlock, parseLanguage } from "@ngrok/mantle/code-block";

import { CodeBlockWithInfo } from "./CodeBlockWithInfo";
import { LangTab } from "./LangSwitcher/LangTab";
import { defaultLanguageInfo } from "./LangSwitcher/data";
import { getLanguageInfo, getMetaData } from "./LangSwitcher/utils";

type WithIndentation = Pick,
	"indentation"
>;

type Props = WithStyleProps & {
	/**
	 * The code content inside the block. This contains the raw code to display as a string.
	 */
	children, language-js, language-python).
	 */
	className?: string;
	/**
	 * The icon to display in the header of the code block.
	 */
	icon?: ReactNode;
	/**
	 * The language of the code block. This is used to determine the syntax highlighting of the code block.
	 */
	language?: SupportedLanguage;
	/**
	 * Additional metadata for the code block. Contains custom information passed after the language in the Markdown code block. Useful for features like line highlighting or titles.
	 */
	metastring?: string;
	/**
	 * The mode of the code block. This is displayed as an icon in the header of the code block.
	 */
	mode?: Mode;
	/**
	 * The title of the code block. This is displayed in the header of the code block.
	 */
	title?: string;
} & WithIndentation;

/**
 * A code block component that support
 */
function DocsCodeBlock({
	children,
	className,
	icon,
	indentation,
	language,
	metastring,
	mode,
	title,
	...props
}: Props) {
	const langMatchesInClassName = className?.match(/language-(\w+)/);
	const langInClassName = langMatchesInClassName
		? langMatchesInClassName[0]?.split("-")[1]
		: "";
	const langToFind = langInClassName || parseLanguage(langInClassName);

	const language = getLanguageInfo(langToFind) || defaultLanguageInfo;

	const meta = getMetaData(
		metastring ? `${className} ${metastring}` : className,
	);

	return (
		
			}
			info={language}
			codeBlockProps={props}
		/>
	);
}

/**
 * Fallback (loading) component for the code block.
 */
const CodeBlockFallback = ({
	children,
	...props
}: ComponentProps) => (
	
		
			{children}
		
	
);

export default DocsCodeBlock;

export {
	//,
	CodeBlockFallback,
};
