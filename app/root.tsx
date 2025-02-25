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

export const links: LinksFunction = () => [
  {
    rel: "icon",
    href:
      process.env.NODE_ENV === "development"
        ? "/dev-favicon.ico"
        : "/favicon.ico",
    type: "image/png",
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

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const data = useLoaderData<LoaderData>();
  useEffect(() => {
    processClientSideRedirect(location, navigate);
  }, []);
  return (
    <html lang="en">
      <head>
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
        <Container>
          <Outlet />
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
