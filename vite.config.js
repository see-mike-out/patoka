import { defineConfig } from "vite";
import anywidget from "@anywidget/vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

export default defineConfig({
    // watch: ['patoka/*'],
    build: {
		outDir: "widget_dist",
		lib: {
			entry: ["index.js"],
			formats: ["es"],
		},
	},
	plugins: [
		svelte({ hot: false }),
		anywidget(),
	],
});