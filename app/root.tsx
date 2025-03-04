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
import { shouldRedirect } from "./utils/redirects/redirectMethods";
import { useEffect } from "react";
import Container from "./components/layout/Container";
import { getDomainUrl, removeTrailingSlash } from "./utils";
import ErrorPage from "@components/ErrorPage";

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
  const url = getDomainUrl(request);
  const path = new URL(request.url).pathname;

  const { result, newPath } = shouldRedirect(path);
  if (result) {
    return redirect(newPath as string);
  }

  return json({
    canonical: removeTrailingSlash(`${url}${path}`),
    requestInfo: {
      url: removeTrailingSlash(`${url}${path}`),
      origin: getDomainUrl(request),
      path: new URL(request.url).pathname,
    },
    algoliaInfo: {
      appId: process.env.ALGOLIA_APP_ID,
      indexName: process.env.ALGOLIA_INDEX_NAME,
      apiKey: process.env.ALGOLIA_API_KEY,
    },
  });
};

const processClientSideRedirect = (
  location: Location,
  navigate: NavigateFunction
) => {
  const { pathname, hash } = location;
  if (hash) {
    const { result, newPath } = shouldRedirect(pathname + hash);
    if (result) {
      navigate(newPath as string, { replace: true });
    }
  }
};

function Hit({ hit }: { hit: any }) {
  return (
    <article>
      <p>{JSON.stringify(hit, null, 2)}</p>
      <br />
      <br />
    </article>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const data = useLoaderData<LoaderData>();
  useEffect(() => {
    processClientSideRedirect(location, navigate);
  }, []);
  if (!data) return <ErrorPage />;
  return (
    <html lang="en">
      <head>
        <link
          rel="preconnect"
          href="https://YOUR_APP_ID-dsn.algolia.net"
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
          <ThemeProvider>
            <Outlet />
          </ThemeProvider>
        </Container>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
