/**
 * This is the skeleton of a custom search implementation
 * that we can implement in the future using mantle.
 * It's not being used right now. `<DocSeach />`
 * is being used instead.
 */
import { InstantSearch } from "react-instantsearch";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@ngrok/mantle/dialog";
import { SearchButton } from "@components/Search/SearchButton";
import { SearchInput } from "@components/Search/SearchInput";
import { SearchHits } from "@components/Search/SearchHits";
import { liteClient as algoliasearch } from "algoliasearch/lite";
import { Button } from "@ngrok/mantle/button";

const searchClient = algoliasearch(
  "8D7MHVMLBR",
  "2a1bbbf2894c399133c99758c0cb4bae"
);

export function Search() {
  return (
    <InstantSearch indexName="ngrok" searchClient={searchClient}>
      <Dialog>
        <DialogTrigger asChild>
          <Button type="button">
            <SearchButton />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Search</DialogTitle>
            <SearchInput />
          </DialogHeader>
          <DialogBody>
            <SearchHits />
          </DialogBody>
          <DialogFooter>
            <p>Footer</p>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </InstantSearch>
  );
}
