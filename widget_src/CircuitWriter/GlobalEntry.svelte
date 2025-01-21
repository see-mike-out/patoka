<script>
  import { writable } from "svelte/store";

  export let glb = {},
    data = writable(),
    oi,
    gi;
</script>

<div class="input-form">
  <label for={`global-${oi}-${gi}`}>{glb.name}</label>
  {#if glb.type === "bool_exp"}
    <input
      style="width: 300px;"
      type="text"
      name={`global-${oi}-${gi}`}
      id={`global-${oi}-${gi}`}
      value={$data.operations[oi]?.globals?.[glb.key] || ""}
      on:change={(e) => {
        data.update((d) => {
          if (!d.operations[oi].globals) {
            d.operations[oi].globals = {};
          }
          d.operations[oi].globals[glb.key] = e.target.value;
          return d;
        });
      }}
    />
  {:else if glb.type === "number"}
    <input
      style="width: 300px;"
      type="number"
      name={`global-${oi}-${gi}`}
      id={`global-${oi}-${gi}`}
      value={$data.operations[oi]?.globals?.[glb.key] || ""}
      on:change={(e) => {
        data.update((d) => {
          if (!d.operations[oi].globals) {
            d.operations[oi].globals = {};
          }
          d.operations[oi].globals[glb.key] = e.target.value;
          return d;
        });
      }}
    />
  {:else if glb.type === "string"}
    <input
      style="width: 300px;"
      type="text"
      name={`global-${oi}-${gi}`}
      id={`global-${oi}-${gi}`}
      value={$data.operations[oi]?.globals?.[glb.key] || ""}
      on:change={(e) => {
        data.update((d) => {
          if (!d.operations[oi].globals) {
            d.operations[oi].globals = {};
          }
          d.operations[oi].globals[glb.key] = e.target.value;
          return d;
        });
      }}
    />
  {:else if glb.type === "boolean"}
    <div class="checkbox-group solo">
      <input
        type="checkbox"
        name={`global-${oi}-${gi}`}
        id={`global-${oi}-${gi}`}
        checked={$data.operations[oi]?.globals?.[glb.key]}
        on:change={(e) => {
          data.update((d) => {
            if (!d.operations[oi].globals) {
              d.operations[oi].globals = {};
            }
            d.operations[oi].globals[glb.key] = e.target.checked;
            return d;
          });
        }}
      />
    </div>
  {:else if glb.type === "select"}
    <select
      name={`global-${oi}-${gi}`}
      id={`global-${oi}-${gi}`}
      value={$data.operations[oi]?.globals?.[glb.key] || ""}
      on:change={(e) => {
        data.update((d) => {
          if (!d.operations[oi].globals) {
            d.operations[oi].globals = {};
          }
          if (e.target.value === "null") {
            delete d.operations[oi].globals[glb.key];
          } else {
            d.operations[oi].globals[glb.key] = e.target.value;
          }
          return d;
        });
      }}
    >
      <option
        value={"null"}
        selected={!($data.operations[oi]?.globals?.[glb.key] || "")}>-</option
      >
      {#each glb.option as opt, ti}
        <option
          value={opt.key}
          selected={($data.operations[oi]?.globals?.[glb.key] || "") ===
            opt.key}>{opt.name}</option
        >
      {/each}
    </select>
  {/if}
</div>

<style>
  .input-row {
    display: flex;
    column-gap: 1rem;
    row-gap: 1rem;
    font-size: 0.9rem;
    margin-top: 0.25rem;
    margin-bottom: 0.5rem;
    max-width: 80vw;
    flex-wrap: wrap;
  }

  .input-form {
    display: flex;
  }
  .input-form > label {
    display: block;
    padding: 0.5rem 0.5rem;
    border: 1px solid #ddd;
    border-radius: 0.25rem 0 0 0.25rem;
    background-color: #f0f0f0;
    font-family: var(--font-mono);
    line-height: 100%;
  }
  .input-form > input,
  .input-form > select {
    display: block;
    /* appearance: none; */
    padding: 0.25rem 0.5rem;
    border: 1px solid #ddd;
    border-left-width: 0;
    border-radius: 0 0.25rem 0.25rem 0;
    font-family: var(--font-mono);
    line-height: 100%;
  }

  .checkbox-group {
    display: flex;
    /* column-gap: 1rem; */
    padding: 0;
    border: 1px solid #ddd;
    border-left-width: 0;
    border-radius: 0 0.25rem 0.25rem 0;
    font-family: var(--font-mono);
    line-height: 100%;
    flex-wrap: wrap;
    max-width: 80vw;
    /* overflow-x: scroll; */
  }
  .checkbox-group.solo {
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }
  .checkbox-item {
    display: flex;
    align-items: center;
    /* border-left: 1px solid #ddd; */
    padding: 0.25rem 0.5rem;
  }
  .checkbox-item:first-of-type {
    border-left: 0;
  }
  .checkbox-group input {
    display: block;
    line-height: 100%;
  }
  .checkbox-group label {
    display: block;
    font-family: var(--font-mono);
    line-height: 100%;
    padding-left: 0.25rem;
    padding-right: 0.25rem;
  }
</style>
