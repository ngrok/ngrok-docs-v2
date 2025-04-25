import {
  data,
  LoaderFunction,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { Outlet, useLoaderData, useMatches } from "@remix-run/react";
import TableOfContents from "@components/TOC";
import { getHeadings, Heading } from "~/utils/getHeadings";
import { checkForRedirects } from "~/utils/redirects/redirectMethods";
import useBreakpoint from "use-breakpoint";

export type LoaderData = {
  headings: Heading[];
};

export const loader: LoaderFunction = async ({
  request,
}: LoaderFunctionArgs) => {
  const urlData = new URL(request.url);
  const { pathname } = urlData;

  // Probably can just pass redirect() to checkForRedirects to simplify this
  const { result, newPath } = checkForRedirects(pathname);
  if (result) {
    return redirect(newPath as string);
  }
  const headings = await getHeadings(pathname);

  return data({
    headings,
  });
};

function getTitleFromMatches(matches: any[]) {
  const { handle } = matches[matches.length - 1];
  if (!handle) return null;
  type MatchHandle = {
    title?: string;
  };
  return (handle as MatchHandle[]).find((item: any) => item.title)?.title || "";
}

export default function Docs() {
  const BREAKPOINTS = { mobile: 0, tablet: 768, desktop: 1280 };
  const { breakpoint, maxWidth, minWidth } = useBreakpoint(
    BREAKPOINTS,
    "desktop"
  );

  const { headings } = useLoaderData<LoaderData>();
  const matches = useMatches();
  const title = getTitleFromMatches(matches);
  return (
    <div className="flex max-w-full">
      {breakpoint === "desktop" ? (
        <>
          <div className="w-[100%]">
            {title && <h1>{title}</h1>}
            <Outlet />
          </div>
          <TableOfContents headings={headings} />
        </>
      ) : (
        <div className="relative">
          <TableOfContents headings={headings} />
          <div className="">
            {title && <h1>{title}</h1>}
            <Outlet />
          </div>
        </div>
      )}
    </div>
  );
}
