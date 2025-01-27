<script>
  import { writable } from "svelte/store";
  import Cart from "./Cart.svelte";
  import { titles, descriptions, markers } from "./meta_info";
  import { onMount } from "svelte";
  export let key = "",
    value,
    addToBasket,
    basket,
    level = 1,
    code_header = "",
    code_type = "",
    code_footer = "";

  onMount(() => {});
</script>

<article>
  {#if addToBasket}
    <button
      class="basket"
      on:click={() => {
        addToBasket(key);
      }}
    >
      <Cart on={$basket.includes(key)}></Cart>
    </button>
  {/if}
  {#if level == 1}
    <h2>{titles[key]}</h2>
  {:else if level == 2}
    <h3>{titles[key]}</h3>
  {/if}
  <div class="value">
    {#each value as v, i}
      <div class="chip">
        <div class="i">{i}</div>
        <div class="v">{v}</div>
        <div class="b">
          {#if addToBasket}
            <button
              class="basket"
              on:click={() => {
                addToBasket(`${key}_${i} = ${code_header}${i}${code_footer}`);
              }}
            >
              <Cart
                on={$basket.includes(
                  `${key}_${i} = ${code_header}${i}${code_footer}`,
                )}
              ></Cart>
            </button>
          {/if}
        </div>
      </div>
    {/each}
  </div>
  {#if descriptions[key]}
    <div class="desc">{descriptions[key]}</div>
  {/if}
</article>

<style>
  article {
    position: relative;
    padding: 0.5rem;
    border: 1px solid #aaa;
    background-color: #fafafa;
    box-shadow: 2px 2px 0 0 rgba(0, 0, 0, 0.15);
    grid-column: span 6;
  }
  .basket {
    position: absolute;
    top: 0.25rem;
    right: 0.25rem;
    padding: 0.25rem 0.5rem;
    appearance: none;
    border: 0;
    background-color: transparent;
    cursor: pointer;
    border-radius: 0.25rem;
    line-height: 100%;
  }
  .basket:hover {
    background-color: rgba(0, 0, 0, 0.15);
  }
  .chip .basket {
    position: relative;
    top: 0;
    right: 0;
    padding: 0;
  }
  h2 {
    font-size: 0.9rem;
    font-weight: 600;
    margin: 0 0 0.5rem 0;
  }
  h3 {
    font-size: 0.9rem;
    font-weight: 600;
    margin: 0 0 0.5rem 0;
  }
  .value {
    font-family: var(--font-mono);
    max-height: 200px;
    overflow-y: scroll;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    column-gap: 1rem;
    row-gap: 0.5rem;
  }
  .desc {
    font-size: 0.85rem;
    color: #787878;
    margin-top: 0.5rem;
  }
  .chip {
    display: flex;
    column-gap: 0;
    border: 0;
    padding: 0;
    margin: 0;
    width: 100%;
    justify-content: space-between;
    grid-column: span 1;
  }
  .chip * {
    font-family: var(--font-mono);
    font-size: 0.9rem;
  }
  .chip > * {
    border-style: solid;
    border-color: #dddddd;
  }
  .chip .i {
    padding: 0.25rem;
    border-radius: 0.25rem 0 0 0.25rem;
    border-width: 1px;
    background-color: #f0f0f0;
  }
  .chip .v {
    padding: 0.25rem;
    border-radius: 0;
    border-width: 1px 0 1px 0;
    background-color: #ffffff;
    width: 100%;
  }
  .chip .b {
    padding: 0.25rem;
    border-radius: 0 0.25rem 0.25rem 0;
    border-width: 1px;
    background-color: #ffffff;
  }
</style>
