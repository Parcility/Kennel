// vite.config.js
import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
	build: {
		lib: {
			entry: resolve(__dirname, "lib/index.ts"),
			name: "Kennel",
			// the proper extensions will be added
			fileName: "kennel",
		},
	},
});
