<script>
  import { writable } from "svelte/store";

  export let param = {},
    data = writable(),
    oi,
    pi;
</script>

{#if param.type === "radian"}
  <div class="input-form">
    <label for={`param-${param.key}-${oi}-${pi}`}
      >{param.name} ({param.type})</label
    >
    <input
      type="text"
      name={`param-${param.key}-${oi}-${pi}`}
      id={`param-${param.key}-${oi}-${pi}`}
      match="^[0-9]+[\.\/][0-9]+$"
      value={$data.operations[oi]?.params?.[param.key] || ""}
      on:change={(e) => {
        data.update((d) => {
          if (!d.operations[oi].params) {
            d.operations[oi].params = {};
          }
          d.operations[oi].params[param.key] = e.target.value;
          return d;
        });
      }}
    />
  </div>
{:else if param.type === "number"}
  <div class="input-form">
    <label for={`param-${param.key}-${oi}-${pi}`}
      >{param.name} ({param.type})</label
    >
    <input
      type="number"
      name={`param-${param.key}-${oi}-${pi}`}
      id={`param-${param.key}-${oi}-${pi}`}
      value={$data.operations[oi]?.params?.[param.key] || ""}
      on:change={(e) => {
        data.update((d) => {
          if (!d.operations[oi].params) {
            d.operations[oi].params = {};
          }
          d.operations[oi].params[param.key] = parseFloat(e.target.value);
          return d;
        });
      }}
    />
  </div>
{:else if param.type === "string"}
  <div class="input-form">
    <label for={`param-${param.key}-${oi}-${pi}`}
      >{param.name} ({param.type})</label
    >
    <input
      type="text"
      name={`param-${param.key}-${oi}-${pi}`}
      id={`param-${param.key}-${oi}-${pi}`}
      value={$data.operations[oi]?.params?.[param.key] || ""}
      on:change={(e) => {
        data.update((d) => {
          if (!d.operations[oi].params) {
            d.operations[oi].params = {};
          }
          d.operations[oi].params[param.key] = e.target.value;
          return d;
        });
      }}
    />
  </div>
{:else if param.type === "select"}
  <div class="input-form">
    <label for={`param-${param.key}-${oi}-${pi}`}
      >{param.name} ({param.type})</label
    >
    <select
      name={`param-${param.key}-${oi}-${pi}`}
      id={`param-${param.key}-${oi}-${pi}`}
      value={$data.operations[oi]?.params?.[param.key] || ""}
      on:change={(e) => {
        data.update((d) => {
          if (!d.operations[oi].params) {
            d.operations[oi].params = {};
          }
          if (e.target.value === "null") {
            delete d.operations[oi].params[param.key];
          } else {
            d.operations[oi].params[param.key] = e.target.value;
          }
          return d;
        });
      }}
    >
      <option
        value={"null"}
        selected={!($data.operations[oi]?.params?.[param.key] || "")}>-</option
      >
      {#each param.option as opt, ti}
        <option
          value={opt.key}
          selected={($data.operations[oi]?.params?.[param.key] || "") ===
            opt.key}>{opt.name}</option
        >
      {/each}
    </select>
  </div>
{/if}

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
