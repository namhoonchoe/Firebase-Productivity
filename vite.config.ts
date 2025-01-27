import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), dts()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    lib: {
      entry: "./src/index.ts",
      name: "MyLib",
      formats: ["es", "umd"],
      fileName: (format) => `my-lib.${format}.js`,
    },
    rollupOptions: {
      external: ["react", "react-dom", "**/*.stories.tsx"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
        banner: '"use client";',
        interop: "auto",
      },
    },
    commonjsOptions: {
      esmExternals: ["react"],
    },
  },
});
