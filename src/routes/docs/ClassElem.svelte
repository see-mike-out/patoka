<script>
  export let class_def = {};
</script>

{#if class_def}
  <code><span class="func">{class_def._class}</span></code>
{/if}

<style>
  code,
  code span {
    font-family: var(--monospace);
    color: #999;
  }
  code .func {
    color: #222;
  }
</style>
