import "@ngrok/mantle/mantle.css";
import {
  MantleThemeHeadContent,
  ThemeProvider,
} from "@ngrok/mantle/theme-provider";
import {
  data,
  Links,
  Location,
  Meta,
  NavigateFunction,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useLocation,
  useNavigate,
  useRouteError,
} from "@remix-run/react";
import type {
  LinksFunction,
  LoaderFunction,
  LoaderFunctionArgs,
} from "@remix-run/node";

import "./tailwind.css";
import { checkForRedirects } from "./utils/redirects/redirectMethods";
import { useEffect, useState } from "react";
import Container from "./components/layout/Container";
import { getDomainUrl, removeTrailingSlash } from "./utils";
import ErrorPage from "@components/ErrorPage";
import { MDXProvider } from "@mdx-js/react";
import { getStoredTab, tabParamName } from "@components/Tabs/utils";
import TabListContext from "@components/Tabs/TabListContext";
import LangSwitcherContext from "@components/LangSwitcher/LangSwitcherContext";
import {
  getStoredLanguage,
  langParamName,
} from "@components/LangSwitcher/utils";
import { globalComponents } from "./utils/componentsToImport";

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

  return data({
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
  const [isBrowser, setIsBrowser] = useState(false);

  const storedTab = isBrowser ? getStoredTab() : null;
  const [selectedTabItem, setSelectedTabItem] = useState(storedTab ?? null);
  const storedLang = isBrowser ? getStoredLanguage() : null;
  const [selectedLanguage, setSelectedLanguage] = useState(storedLang ?? null);

  const updateTabOrLanguageFunction = (type: string) => {
    const param = type === "tab" ? tabParamName : langParamName;
    const updateFunction =
      type === "tab" ? setSelectedTabItem : setSelectedLanguage;
    return (newItem: string | undefined) => {
      if (!newItem) return;
      if (isBrowser) {
        localStorage.setItem(param, newItem);
      }
      updateFunction(newItem);
    };
  };

  const updateSelectedTabItem = updateTabOrLanguageFunction("tab");
  const updateSelectedLanguage = updateTabOrLanguageFunction("lang");

  const location = useLocation();
  const navigate = useNavigate();
  const data = useLoaderData<LoaderData>();
  useEffect(() => {
    if (!isBrowser) {
      return setIsBrowser(typeof window !== "undefined");
    }
    setSelectedLanguage(storedLang);
    processClientSideRedirects(location, navigate);
  }, [isBrowser]);

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

        <TabListContext.Provider
          value={{
            localStorageTab: storedTab ?? null,
            selectedTabItem,
            updateSelectedTabItem,
          }}
        >
          <LangSwitcherContext.Provider
            value={{
              localStorageLanguage: storedLang ?? null,
              selectedLanguage,
              updateSelectedLanguage,
            }}
          >
            <body>
              <Container algoliaInfo={data.algoliaInfo}>
                <MDXProvider components={globalComponents}>
                  <Outlet />
                </MDXProvider>
              </Container>
              <ScrollRestoration />
              <Scripts />
            </body>
          </LangSwitcherContext.Provider>
        </TabListContext.Provider>
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

/**
 * 404 page
 */
export function ErrorBoundary() {
  const error = useRouteError();
  console.error(error);
  return (
    <html>
      <head>
        <title>Oh no!</title>
        <Meta />
        <Links />
      </head>
      <body>
        This page doesn't exist. Please check the URL and try again.
        <Scripts />
      </body>
    </html>
  );
}
