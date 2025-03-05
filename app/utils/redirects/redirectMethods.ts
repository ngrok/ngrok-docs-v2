import { redirect } from "@remix-run/node";
import { fromExact, toExact } from "./pathMethods";
import { allRedirects } from "./redirectAggregator";
import { NavigateFunction } from "@remix-run/react";

export const checkForRedirects = (path: string) => {
  // set new path to current path
  let newPath: string | (string | boolean)[] = path;
  // iterate over each redirect, when a match is found, update newPath
  // we do this until the list is finished letting us stack redirects:
  // redirect A (2018) -> redirect B (2020) -> redirect C (current year)
  for (const redirect of allRedirects) {
    let fromFn = redirect[0] as any;
    let toFn = redirect[1];

    // Sugar for exact matching
    if (typeof fromFn === "string") {
      fromFn = fromExact(fromFn);
    }

    // Sugar for exact replacement
    if (typeof toFn === "string") {
      toFn = toExact(toFn);
    }

    const [from, fromResult] = fromFn(path);
    if (fromResult) {
      newPath = toFn(path, from) as any;
    }
  }

  // redirect when the path has changed
  if (newPath !== path) {
    return { result: true, newPath };
  }

  // console.error(
  //   `ignoring redirect from ${path} to ${newPath}; looks loopy`
  // );
  return { result: false, newPath };
};
