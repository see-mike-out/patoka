<script>
  import Cart from "./Cart.svelte";
  import { titles, descriptions, markers } from "./meta_info";
  export let key = "",
    value,
    addToBasket,
    basket,
    level = 1;
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
    {#if value !== undefined && key === "meas_map"}
      {#each value as v, i}
        <div class="meas_grouping">
          <strong
            >Group {i + 1}
            {#if addToBasket}
              <button
                class="basket"
                on:click={() => {
                  addToBasket(`meas_map_${i} = backend.meas_map[${i}]`);
                }}
              >
                <Cart
                  on={$basket.includes(
                    `meas_map_${i} = backend.meas_map[${i}]`,
                  )}
                ></Cart>
              </button>
            {/if}</strong
          >
          {v.join(", ")}
        </div>
      {/each}
    {:else if value !== undefined && value?.constructor.name === "Array"}
      {value.join(", ")}
    {:else if value !== undefined}
      {value}
    {/if}
  </div>
  {#if descriptions[key]}
    <div class="desc">{descriptions[key]}</div>
  {/if}
</article>

<style>
  article {
    position: relative;
    max-width: 100%;
    padding: 0.5rem;
    border: 1px solid #aaa;
    background-color: #fafafa;
    box-shadow: 2px 2px 0 0 rgba(0, 0, 0, 0.15);
    grid-column: span 2;
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

  .meas_grouping .basket {
    position: relative;
    padding: 0.15rem;
  }
  h2 {
    font-size: 0.9rem;
    font-weight: 600;
    margin: 0 0 0.5rem 0;
    padding-right: 1.5rem;
  }
  h3 {
    font-size: 0.9rem;
    font-weight: 600;
    margin: 0 0 0.5rem 0;
    padding-right: 1.5rem;
  }
  .value {
    font-family: var(--font-mono);
    font-size: 1.1rem;
  }
  .desc {
    font-size: 0.85rem;
    color: #787878;
    margin-top: 0.5rem;
  }
  .meas_grouping {
    margin-bottom: 0.25rem;
  }
  .meas_grouping,
  .meas_grouping * {
    font-family: var(--font-mono);
    font-size: 0.9rem;
  }
  .meas_grouping strong {
    display: block;
    font-weight: 600;
    margin-bottom: 0.25rem;
  }
</style>
