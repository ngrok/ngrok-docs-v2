import { Button } from "@ngrok/mantle/button";
import { useContext } from "react";
import { CodeBlockWithInfo } from "../CodeBlockWithInfo";
import LangSwitcherContext, {
  type LangSwitcherContextType,
} from "./LangSwitcherContext";
import { getLanguageInfo, getMetaData, languagesAreSynonyms } from "./utils";
import { ClientOnly } from "remix-utils/client-only";

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function LangSwitcher({ children, className, ...props }: any) {
  const { localStorageLanguage, selectedLanguage, updateSelectedLanguage } =
    useContext<LangSwitcherContextType>(LangSwitcherContext);

  if (!updateSelectedLanguage) return "Error loading code block";

  // if no language tab is set yet
  if (selectedLanguage === null) {
    // Check if the user has specified a default language
    const startingLanguage =
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      children.find(
        (child: any) => {
          child.props.codeblock.lang === localStorageLanguage;
        }
        // if no default language is set,
        // use the first tab in the array
      )?.props.codeblock || children[0].props.codeblock;
    updateSelectedLanguage(startingLanguage?.lang);
  }

  const matchingBlock =
    children.find(
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      (child: any) =>
        child.props.codeblock.lang === selectedLanguage ||
        languagesAreSynonyms(child.props.codeblock.lang, selectedLanguage)
    )?.props.codeblock || children[0].props.codeblock;

  return (
    <ClientOnly>
      {() => (
        <CodeBlockWithInfo
          content={matchingBlock?.value}
          language={matchingBlock?.lang}
          meta={matchingBlock?.meta}
          className={className}
          headerContent={
            <div className="flex w-[100%] gap-1.5">
              {/* biome-ignore lint/suspicious/noExplicitAny: <explanation> */}
              {children.map((child: any) => {
                const { codeblock } = child.props;
                const childMeta = getMetaData(codeblock.meta);
                return (
                  <Button
                    key={codeblock.lang + codeblock.value}
                    onClick={() => {
                      return updateSelectedLanguage(codeblock.lang);
                    }}
                    type="button"
                    priority="neutral"
                    appearance={
                      matchingBlock?.lang === codeblock.lang
                        ? "filled"
                        : "outlined"
                    }
                  >
                    {childMeta.tabName || codeblock.lang.toUpperCase()}
                  </Button>
                );
              })}
            </div>
          }
          info={getLanguageInfo(matchingBlock?.lang)}
          codeBlockProps={props}
        />
      )}
    </ClientOnly>
  );
}
