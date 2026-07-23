import { defineConfig } from "vite";

export default defineConfig({
  root: "web",
  base: "./",
  server: {
    fs: { allow: [".."] },
  },
  build: {
    outDir: "../dist-web",
    emptyOutDir: true,
  },
});
