<script>
  import MonacoEditor from "$lib/monaco/monacoEditor.svelte";
  import { onMount } from "svelte";
  import { writable } from "svelte/store";

  export let id = "example",
    codes = [],
    lines = 0;

  let code_store = writable("");
  onMount(() => {
    code_store.set(codes.join("\n"));
    lines = codes.length;
  });
</script>

<div class="wrapper">
  <MonacoEditor
    containerId={id}
    code={code_store}
    readOnly={true}
    use_minimap={false}
    height={`${lines * 1.15}rem`}
  ></MonacoEditor>
</div>

<style>
  .wrapper {
    padding: 0.5rem;
    border-radius: 0.5rem;
    border: 1px solid #ddd;
  }
</style>