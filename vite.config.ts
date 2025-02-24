import { defineConfig } from "vite"

export default defineConfig({
  base: "/wordle/",
  root: ".",
  build: {
    outDir: "../dist", 
    emptyOutDir: true, 
  },
  server: {
    port: 5000,
  }
})
