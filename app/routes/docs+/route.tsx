import {
  data,
  LoaderFunction,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { Outlet, useLoaderData, useMatches } from "@remix-run/react";
import TableOfContents from "@components/TOC";
import { getHeadings, Heading } from "~/utils/getHeadings";
import { create } from "@kodingdotninja/use-tailwind-breakpoint";
import { checkForRedirects } from "~/utils/redirects/redirectMethods";

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
  const { useBreakpoint } = create({
    // We can change this number at any point; this is a placeholder
    md: "768px",
  });

  const isDesktop = useBreakpoint("md");

  const { headings } = useLoaderData<LoaderData>();
  const matches = useMatches();
  const title = getTitleFromMatches(matches);
  return (
    <div className="flex">
      {isDesktop ? (
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
            <Outlet />
          </div>
        </div>
      )}
    </div>
  );
}
