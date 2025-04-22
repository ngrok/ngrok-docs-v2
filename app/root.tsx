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
import { SupportedLanguage } from "@ngrok/mantle/code-block";
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

  // Probably can just pass redirect() to checkForRedirects to simplify this
  const { result, newPath } = checkForRedirects(path);
  if (result) {
    return redirect(newPath as string);
  }

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
  const storedLang = isBrowser ? getStoredLanguage() : null;

  const [selectedLanguage, setSelectedLanguage] = useState(storedLang ?? null);
  const updateSelectedLanguage = (
    newLang: string | SupportedLanguage | undefined
  ) => {
    console.log("Hello");
    if (!newLang) return;
    if (isBrowser) {
      localStorage.setItem(langParamName, newLang);
    } else {
      console.log("Not able to write to localStorage", newLang);
    }
    setSelectedLanguage(newLang);
  };

  const [selectedTabItem, setSelectedTabItem] = useState(storedTab ?? null);
  const updateSelectedTabItem = (newItem: string | undefined) => {
    if (!newItem) return;
    if (isBrowser) {
      localStorage.setItem(tabParamName, newItem);
    }
    setSelectedTabItem(newItem);
  };

  const location = useLocation();
  const navigate = useNavigate();
  const data = useLoaderData<LoaderData>();
  useEffect(() => {
    setIsBrowser(typeof window !== "undefined");
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

        <TabListContext.Provider
          value={{
            localStorageTab: storedTab ?? null,
            selectedTabItem,
            updateSelectedTabItem,
          }}
        >
          <LangSwitcherContext.Provider
            value={{
              defaultLanguage: storedLang ?? null,
              selectedLanguage,
              updateSelectedLanguage,
            }}
          >
            <body>
              <Container algoliaInfo={data.algoliaInfo}>
                {/* Add components here so they can replace existing tags like <code> or <a> */}
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
