import { Hits } from "react-instantsearch";
import { HitItem } from "./HitItem";

export function SearchHits() {
  return <Hits hitComponent={HitItem} />;
}
