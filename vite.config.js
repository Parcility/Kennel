// vite.config.js
import { resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
	build: {
		lib: {
			entry: resolve(__dirname, "lib/index.ts"),
			name: "Kennel",
			// the proper extensions will be added
			fileName: "index",
		},
		sourcemap: "inline",
		rollupOptions: {
			external: ["fs", "jsdom"],
		},
	},
	plugins: [dts()],
});
