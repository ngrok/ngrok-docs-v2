import {
  MetaFunction,
  json,
  LoaderFunctionArgs,
  SerializeFrom,
} from "@vercel/remix";
import { Link, useLoaderData } from "@remix-run/react";
import { DocsPage as DocsPageType } from "~/types";
import { getContent } from "~/utils/docs.server";
import DocsPageLink from "~/components/DocsPageLink";
import { CacheControl } from "~/utils/cache-control.server";
import { getSeo } from "~/seo";
import { remixRoutesOptionAdapter } from "@react-router/remix-routes-option-adapter";
import { flatRoutes } from "remix-flat-routes";

import { MarkdownView } from "~/components/Markdown";
import { parseMarkdown } from "~/utils/markdoc.server";

export const routes = remixRoutesOptionAdapter((defineRoutes) => {
  return flatRoutes("routes", defineRoutes, {
    ignoredRouteFiles: ["**/*"],
    //appDir: 'app',
    //routeDir: 'routes',
    //basePath: '/',
    //paramPrefixChar: '$',
    //nestedDirectoryChar: '+',
    //routeRegex: /((\${nestedDirectoryChar}[\/\\][^\/\\:?*]+)|[\/\\]((index|route|layout|page)|(_[^\/\\:?*]+)|([^\/\\:?*]+\.route)))\.(ts|tsx|js|jsx|md|mdx)$$/,
  });
});

export const meta: MetaFunction = ({ data, matches }) => {
  if (!data) return [];

  const parentData = matches.flatMap((match) => match.data ?? []);

  return [
    getSeo({
      title: "Docs",
      description: "Docs",
      url: `${parentData[0].requestInfo.url}`,
    }),
  ];
};

export let loader = async function ({}: LoaderFunctionArgs) {
  const files = await getContent(`docs/index`);
  let post = files && parseMarkdown(files[0].content);

  return json(
    {
      post,
    },
    {
      headers: {
        "Cache-Control": new CacheControl("swr").toString(),
      },
    }
  );
};

export default function Index() {
  const { post } = useLoaderData<typeof loader>();

  return (
    <article className="flex flex-col items-start justify-center w-full max-w-2xl mx-auto mb-16">
      <h1 className="mb-4 text-3xl font-bold tracking-tight text-black md:text-5xl dark:text-white">
        {post.attributes.meta.title}
      </h1>
      <div className="w-full mt-4 prose dark:prose-dark max-w-none">
        {post.body && <MarkdownView content={post.body} />}
      </div>
    </article>
  );
}
