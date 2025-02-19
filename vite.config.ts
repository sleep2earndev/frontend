import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"
import { VitePWA } from "vite-plugin-pwa";
import manifestForPlugIn from "./manifest";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), VitePWA(manifestForPlugIn)],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
