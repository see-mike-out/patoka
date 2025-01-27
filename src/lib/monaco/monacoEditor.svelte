<script>
	import { onMount } from "svelte";
	import { browser } from "$app/environment";
	import { writable } from "svelte/store";
	import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
	import jsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker";
	import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker";
	import { PythonFormat } from "./monaco-python";

	export let containerId = "monaco-container",
		code = writable(""),
		language = "python",
		height = "100%",
		readOnly = false,
		use_minimap = true,
		onchange = (e) => {};

	if (browser) {
		self.MonacoEnvironment = {
			getWorker: function (workerId, label) {
				switch (label) {
					case "json":
						return new jsonWorker();
					case "javascript":
						return new tsWorker();
					default:
						return new editorWorker();
				}
			},
		};
	}

	let monaco, editor, editorSpace, theme;
	onMount(async () => {
		monaco = await import("monaco-editor");
		// Register a new language
		monaco.languages.register({ id: "python" });

		// Register a tokens provider for the language
		monaco.languages.setMonarchTokensProvider("python", PythonFormat);

		editorSpace = document.getElementById(containerId);
		if (editorSpace) editorSpace.innerHTML = "";
		if (editorSpace) {
			editor = monaco?.editor?.create(editorSpace, {
				minimap: {
					enabled: use_minimap,
				},
				value: $code,
				language,
				automaticLayout: true,
				theme,
				readOnly,
				scrollBeyondLastLine: false,
			});
			editor.onDidChangeModelContent(() => {
				onchange(editor.getValue());
			});
		}
		code.subscribe((c) => {
			editor.setValue(c);
		});
	});
</script>

<div
	id={containerId}
	style={`height: ${height ? height : "100%"}; font-family: var(--monospace) !important;`}
/>

<style>
	:global(.monaco-editor *) {
		font-family: "Iosevka Web", monospace !important;
	}
</style>
