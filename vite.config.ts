import { installGlobals } from "@remix-run/node";
import { vitePlugin as remix } from "@remix-run/dev";
const { flatRoutes } = require("remix-flat-routes");
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

installGlobals();

export default defineConfig({
  server: {
    // Use a non-standard port that doesn't conflict with other apps you may be running
    port: 3030,
  },
  plugins: [
    remix({
      ignoredRouteFiles: ["**/*"],
      serverModuleFormat: "cjs",
      tailwind: true,
      routes(defineRoutes) {
        return flatRoutes("routes", defineRoutes);
      },
    }),
    tsconfigPaths(),
  ],
});
