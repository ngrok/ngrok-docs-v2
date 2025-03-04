import { Link } from "@remix-run/react";
import { Hit } from "algoliasearch";

export type DocHitItem = {
  url: string;
  url_without_anchor: string;
  anchor: string;
  content: any;
  type: string;
  hierarchy: {
    lvl0: string; // Name of sidenav category it's under
    lvl1: string; // h1 of the page
    lvl2: string; // h2
    lvl3: string; // etc ...
    lvl4: string;
    lvl5: string;
    lvl6: string;
  };
  objectID: string;
  _highlightResult: {
    hierarchy: {
      lvl0: {
        value: string;
        matchLevel: string;
        matchedWords: string[];
      };
      lvl1: {
        value: string;
        matchLevel: string;
        matchedWords: string[];
      };
    };
  };
  __position: number;
  __queryID: string;
};

export function HitItem({ hit }: { hit: Hit<DocHitItem> }) {
  if (hit.anchor) console.log("Hit", JSON.stringify(hit, null, 2));
  return (
    <Link to={hit.url}>
      <p>{hit.hierarchy.lvl1}</p>
    </Link>
  );
}
