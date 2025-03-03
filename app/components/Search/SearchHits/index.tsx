import { Hits } from "react-instantsearch";
import { HitItem } from "./HitItem";
import { useHits } from "react-instantsearch";
import { Hit } from "algoliasearch";

/**
 * Map the hits such that hits within a page appear together in a sublist
 * under the hit for the page itself, like in prod.
 * If hit content exists, show a portion of it like in prod.
 * Here, we can get really detailed with how we show search results
 * since we own the search component. But that can be done in the future.
 * For now just make it all work like prod.
 */

export function SearchHits(props: any) {
  const { items, results, banner, sendEvent } = useHits(props);
  return (
    <div>
      {items.map((item: Hit<any>) => (
        <HitItem key={item.objectID} hit={item} />
      ))}
    </div>
  );
  // return <Hits hitComponent={HitItem} />;
}
