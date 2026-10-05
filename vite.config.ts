import { resolve } from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  build: {
    rolldownOptions: {
      input: {
        vanilla: resolve(import.meta.dirname, "index.html"),
        react: resolve(import.meta.dirname, "react.html"),
      },
    },
  },
});
