<script>
  import Cart from "./Cart.svelte";
  import { titles, descriptions, markers } from "./meta_info";
  export let key = "",
    value,
    addToBasket,
    basket,
    level = 1,
    code_header = "",
    code_footer = "";
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
    {#if value !== undefined}
      {#each value as a_set, ai}
        <div class="value-row">
          <strong>{a_set.name}</strong>
          {#if addToBasket}
            <button
              class="basket x2"
              on:click={() => {
                addToBasket(`${key}_${ai} = ${code_header}${ai}${code_footer}`);
              }}
            >
              <Cart
                on={$basket.includes(
                  `${key}_${ai} = ${code_header}${ai}${code_footer}`,
                )}
              ></Cart>
            </button>
          {/if}<br />
          {a_set.qubits.join(", ")}
        </div>
      {/each}
    {/if}
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
    grid-column: span 4;
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
  .basket.x2 {
    position: relative;
    top: 0;
    right: 0;
    padding: 0;
  }
  .basket:hover {
    background-color: rgba(0, 0, 0, 0.15);
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
    max-height: 200px;
    font-family: var(--font-mono);
    font-size: 0.9rem;
    overflow: scroll;
  }
  .value-row {
    margin-bottom: 0.5rem;
  }
  .desc {
    font-size: 0.85rem;
    color: #787878;
    margin-top: 0.5rem;
  }
</style>
