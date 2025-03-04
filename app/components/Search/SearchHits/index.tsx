import { Hits } from "react-instantsearch";
import { HitItem } from "./HitItem";
import { useHits } from "react-instantsearch";
import { Hit } from "algoliasearch";

export function SearchHits(props: any) {
  const { items, results, banner, sendEvent } = useHits(props);
  return (
    <div>
      {items.map((item: Hit<any>) => (
        <HitItem key={item.objectID} hit={item} />
      ))}
    </div>
  );
}
