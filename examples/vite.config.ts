import { defineConfig } from "vite";
import { createHtmlPlugin } from "vite-plugin-html";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = fileURLToPath(new URL(".", import.meta.url));
const packageRoot = path.resolve(rootDir, "..");

export default defineConfig({
  root: rootDir,
  plugins: [
    createHtmlPlugin({
      pages: [
        { filename: "index.html", template: "index.html" },
        { filename: "basic/index.html", template: "basic/index.html" },
        { filename: "tailwind/index.html", template: "tailwind/index.html" },
        {
          filename: "ferrari-slider/index.html",
          template: "ferrari-slider/index.html",
          injectOptions: {
            ejsOptions: {
              filename: path.resolve(rootDir, "ferrari-slider/index.html")
            }
          }
        }
      ]
    })
  ],
  appType: "mpa",
  server: {
    open: "/ferrari-slider/index.html",
    fs: {
      allow: [packageRoot]
    }
  },
});
