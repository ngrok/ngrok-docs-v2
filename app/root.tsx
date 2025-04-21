import "@ngrok/mantle/mantle.css";
import {
  MantleThemeHeadContent,
  ThemeProvider,
} from "@ngrok/mantle/theme-provider";
import {
  json,
  Links,
  Location,
  Meta,
  NavigateFunction,
  Outlet,
  redirect,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useLocation,
  useNavigate,
} from "@remix-run/react";
import type {
  LinksFunction,
  LoaderFunction,
  LoaderFunctionArgs,
} from "@remix-run/node";

import "./tailwind.css";
import { checkForRedirects } from "./utils/redirects/redirectMethods";
import { useEffect } from "react";
import Container from "./components/layout/Container";
import { getDomainUrl, removeTrailingSlash } from "./utils";
import ErrorPage from "@components/ErrorPage";
import { MDXProvider } from "@mdx-js/react";
import { components } from "~/utils/componentsToImport";

export const links: LinksFunction = () => [
  {
    rel: "icon",
    href:
      process.env.NODE_ENV === "development"
        ? "/dev-favicon.ico"
        : "/favicon.ico",
    type: "image/ico",
  },
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?fashaquil/doc-111-upgrade-to-remix-2-retrymily=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export type LoaderData = {
  canonical?: string;
  requestInfo: {
    url: string;
    origin: string;
    path: string;
  } | null;
  algoliaInfo: {
    appId: string;
    indexName: string;
    apiKey: string;
  };
};

export const loader: LoaderFunction = async ({
  request,
}: LoaderFunctionArgs) => {
  const origin = getDomainUrl(request);
  const urlData = new URL(request.url);
  const path = urlData.pathname;
  const canonical = removeTrailingSlash(`${origin}${path}`);

  // Probably can just pass redirect() to checkForRedirects to simplify this
  const { result, newPath } = checkForRedirects(path);
  if (result) {
    return redirect(newPath as string);
  }

  // const headings = await getHeadings(path);

  return json({
    // headings,
    canonical,
    requestInfo: {
      url: canonical,
      origin,
      path,
    },
    algoliaInfo: {
      appId: process.env.ALGOLIA_APP_ID,
      indexName: process.env.ALGOLIA_INDEX_NAME,
      apiKey: process.env.ALGOLIA_API_KEY,
    },
  });
};

const processClientSideRedirects = (
  location: Location,
  navigate: NavigateFunction
) => {
  const { pathname, hash } = location;
  if (hash) {
    const { result, newPath } = checkForRedirects(pathname + hash);
    if (result) {
      navigate(newPath as string, { replace: true });
    }
  }
};

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const data = useLoaderData<LoaderData>();
  useEffect(() => {
    processClientSideRedirects(location, navigate);
  }, []);
  if (!data) return <ErrorPage />;
  return (
    <html lang="en">
      <ThemeProvider>
        <head>
          {/* Preconnect to the algolia API for faster search */}
          <link
            rel="preconnect"
            href={`https://${data.algoliaInfo.appId}-dsn.algolia.net`}
            crossOrigin="anonymous"
          />
          <MantleThemeHeadContent />
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width,initial-scale=1" />
          <Meta />
          {data.requestInfo && (
            <link
              rel="canonical"
              href={removeTrailingSlash(
                `${data.requestInfo.origin}${data.requestInfo.path}`
              )}
            />
          )}
          <Links />
        </head>
        <body>
          <Container algoliaInfo={data.algoliaInfo}>
            {/* Add components here so they can be used in mdx files without being imported */}
            {/* To make a component replace an existing tag (like <code> or <a>), add it to codehike in vite.config.ts */}
            <MDXProvider components={components}>
              <Outlet />
            </MDXProvider>
          </Container>
          <ScrollRestoration />
          <Scripts />
        </body>
      </ThemeProvider>
    </html>
  );
}

export default function App() {
  return (
    <body>
      <Outlet />
    </body>
  );
}
