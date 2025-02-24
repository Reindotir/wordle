import { defineConfig } from "vite"

export default defineConfig({
  base: "/wordle/",
  root: ".",
  build: {
    outDir: "dist", 
  },
  server: {
    port: 5000,
  }
})
