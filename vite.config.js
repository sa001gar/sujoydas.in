import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const devEntryPlugin = {
  name: "portfolio-development-entry",
  transformIndexHtml(html, context) {
    if (!context.server) return html;
    return html.replace(
      '<script src="Asset/dist/app.js" defer></script>',
      '<script type="module" src="/src/main.jsx"></script>',
    );
  },
};

export default defineConfig({
  plugins: [react(), devEntryPlugin],
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
  },
  build: {
    outDir: "Asset/dist",
    emptyOutDir: false,
    lib: {
      entry: "src/main.jsx",
      name: "SujoyDasPortfolio",
      formats: ["iife"],
      fileName: () => "app.js",
    },
  },
});
