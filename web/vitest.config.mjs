import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

export default defineConfig({
  plugins: [react({ include: /\.(js|jsx)$/ })],
  // Next.js lets .js files contain JSX; tell Vite the same
  esbuild: { include: /\.(js|jsx)$/, exclude: [], loader: "jsx" },
  resolve: { alias: { "@": fileURLToPath(new URL(".", import.meta.url)) } },
  test: {
    environment: "jsdom",
    setupFiles: ["./tests/setup.js"],
    include: ["tests/**/*.test.{js,jsx}"],
  },
});
