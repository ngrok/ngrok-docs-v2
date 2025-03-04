import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import vitePluginRequire from "vite-plugin-require";
import mdx from "@mdx-js/rollup";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import { flatRoutes } from "remix-flat-routes";
import path from "path";
import { installGlobals } from "@remix-run/node";
import remarkGfm from "remark-gfm";
import { envOnlyMacros } from "vite-env-only";

installGlobals();
declare module "@remix-run/node" {
  interface Future {
    v3_singleFetch: true;
  }
}

export default defineConfig({
  ssr: {
    noExternal: ["@docsearch/react"],
  },
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "./app"),
      "@components": path.resolve(__dirname, "./app/components/"),
      "@shared": path.resolve(__dirname, "./app/shared/"),
    },
  },
  plugins: [
    envOnlyMacros(),
    tsconfigPaths(),
    mdx({
      remarkPlugins: [remarkGfm, remarkFrontmatter, remarkMdxFrontmatter],
    }),
    remix({
      routes(defineRoutes) {
        return flatRoutes("routes", defineRoutes, {
          ignoredRouteFiles: ["**/.*"], // Ignore dot files (like .DS_Store)
        });
      },
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
        v3_singleFetch: true,
        v3_lazyRouteDiscovery: true,
      },
    }),
    vitePluginRequire.default(),
  ],
});
