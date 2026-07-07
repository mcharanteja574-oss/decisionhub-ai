import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: process.env.VITE_BASE_PATH || "/",
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/analyze": "http://127.0.0.1:8000",
      "/health": "http://127.0.0.1:8000",
    },
  },
});
