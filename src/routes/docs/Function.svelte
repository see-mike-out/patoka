<script>
  export let function_def = {};
</script>

{#if function_def}
  <code
    ><span class="func">{function_def.function}</span
    >({#each function_def.arguments as args, i}<span class="arg_keyword"
        >{args.name}</span
      >:
      <span class="arg_type"
        >{args.type}{#if args.optional}={args.default ?? "None"}{/if}</span
      >{#if i < function_def.arguments.length - 1},&nbsp;
      {/if}{/each}) -&gt;
    <span class="return"
      >{function_def?._return.map((d) => d.type).join(", ") ?? "None"}</span
    ></code
  >
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
  code .arg_keyword {
    color: crimson;
  }
  code .arg_type {
    color: teal;
  }
  code .return {
    color: palevioletred;
  }
</style>
