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
import { Sidebar } from "@components/layout/Sidebar";
import { getSidebar, SidebarItem } from "~/utils/sidebar";

export type LoaderData = {
  sidebarData: SidebarItem[] | null;
  headings: Heading[];
  algoliaInfo: {
    appId: string;
    indexName: string;
    apiKey: string;
  };
};



let cachedSidebarData: any | any[] = null;

// Don't wanna fetch this on every page load
async function fetchSidebarData() {
  if (cachedSidebarData) {
    return cachedSidebarData;
  }
  const rawData = await getSidebar();
  const sidebarData = rawData?.map((item: any) => item.value);

  cachedSidebarData = sidebarData;
  return sidebarData;
}

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
  const sidebarData = await fetchSidebarData();

  return data({
    sidebarData,
    headings,
    algoliaInfo: {
      appId: process.env.ALGOLIA_APP_ID,
      indexName: process.env.ALGOLIA_INDEX_NAME,
      apiKey: process.env.ALGOLIA_API_KEY,
    },    
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
  const { breakpoint } = useBreakpoint(
    BREAKPOINTS,
    "desktop"
  );

  // const { headings, algoliaInfo } = useLoaderData<LoaderData>();
  const matches = useMatches();
  const title = getTitleFromMatches(matches);
  const data = useLoaderData<LoaderData>();  
  return (
<div className="flex w-full max-w-full">
  {/* Floating sidebar */}
  <div className="sticky top-0 h-screen w-64 shrink-0">
    <Sidebar
      algoliaInfo={data.algoliaInfo}
      data={data.sidebar}
      className="h-full overflow-y-auto pr-4 overflow-x-hidden"
    />
  </div>

  {/* Main content */}
  {breakpoint === "tablet" || breakpoint === "desktop" ? (
    <div className="w-full max-w-full flex">
      <div className="p-5 w-full max-w-full">
        {title && <h1>{title}</h1>}
        <Outlet />
      </div>
      <TableOfContents className="" headings={data.headings} />
    </div>
  ) : (
    <div className="relative w-full">
      <TableOfContents headings={data.headings} />
        {title && <h1>{title}</h1>}
        <div className="p-5">
        <Outlet />
        </div>
    </div>
  )}
</div>

  );
}
