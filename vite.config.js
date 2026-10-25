import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // GitHub Pages project site: change "/" to "/YOUR-REPOSITORY-NAME/" before deploying.
  base: "/",
});