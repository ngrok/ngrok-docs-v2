import { DocSearch } from "@docsearch/react";
import "@docsearch/css";
import { transformItems } from "./utils/transformItems";

type CustomDocSearchProps = {
  algoliaInfo: {
    appId: string;
    indexName: string;
    apiKey: string;
  };
};

export function CustomDocSearch({ algoliaInfo }: CustomDocSearchProps) {
  return (
    <DocSearch
      apiKey={algoliaInfo.apiKey}
      indexName={algoliaInfo.indexName}
      appId={algoliaInfo.appId}
      transformItems={transformItems}
    />
  );
}
