/// <reference types="vitest/config" />

import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.js"],
    css: true,
  },
  server: {
    port: 3000,
    host: true, // This allows Docker to acces the dev server
  },
  preview: {
    port: 3000,
    host: true, // This allows Docker to access the preview server
  },
});
