<script>
  import Cart from "./Cart.svelte";
  import { titles, descriptions } from "./meta_info";
  export let key = "",
    data,
    addToBasket = () => {},
    checkBasket = () => {};
</script>

<article>
  <div>
    <button
      class="basket"
      on:click={() => {
        addToBasket();
      }}
    >
      <Cart on={checkBasket(key)}></Cart>
    </button>
  </div>
  <h2>{titles[key]}</h2>
  
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
  h2 {
    font-size: 0.9rem;
    font-weight: 700;
    margin: 0 0 0.5rem 0;
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
</style>
