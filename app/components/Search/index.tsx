/**
 * Make a search experience similar to production docs.
 * In prod, the searchbar is actually just a button that opens
 * the search dialog
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
import { useState } from "react";

const searchClient = algoliasearch(
  "8D7MHVMLBR",
  "2a1bbbf2894c399133c99758c0cb4bae"
);

export function Search() {
  const [showDialog, setShowDialog] = useState(false);

  return (
    <InstantSearch indexName="ngrok" searchClient={searchClient}>
      <Dialog open={showDialog}>
        <DialogTrigger asChild>
          <SearchButton setShowDialog={setShowDialog} />
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
