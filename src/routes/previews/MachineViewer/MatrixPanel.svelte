<script>
  import { onMount } from "svelte";
  import Cart from "./Cart.svelte";
  import { titles, descriptions, markers } from "./meta_info";
  export let key = "",
    value,
    addToBasket,
    basket,
    level = 1,
    code_header = "",
    code_type = "",
    code_footer = "";
  let size = [0, 0],
    colorFunc = () => {},
    max_dist = 1;
  onMount(() => {
    if (value) {
      size[0] = value?.length || 0;
      size[1] = value?.[0]?.length || 0;
      max_dist = Math.max(...value?.map((d) => Math.max(...d)));
      colorFunc = (v) => (1 - v / max_dist) * 0.8;
    }
  });
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
  <div class="content-wrap">
    <table>
      <thead>
        <tr>
          <th></th>
          {#each Array(size[1]) as _, j}
            <th>{j}</th>
          {/each}
        </tr>
      </thead>
      <tbody>
        {#each Array(size[0]) as _, i}
          <tr>
            <th>{i}</th>
            {#each Array(size[1]) as _, j}
              <td
                style={`background-color: rgba(255, 102, 13, ${colorFunc(value?.[i]?.[j])})`}
                >{value?.[i]?.[j]}</td
              >
            {/each}
          </tr>
        {/each}
      </tbody>
    </table>
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
  .content-wrap {
    overflow: scroll;
    max-height: 600px;
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
    font-weight: 600;
    margin: 0 0 0.5rem 0;
  }
  h3 {
    font-size: 0.9rem;
    font-weight: 600;
    margin: 0 0 0.5rem 0;
  }
  .desc {
    font-size: 0.85rem;
    color: #787878;
    margin-top: 0.5rem;
  }
  table {
    font-size: 0.9rem;
    border-collapse: collapse;
  }
  table th,
  table td {
    border: 1px solid #ddd;
    text-align: center;
    font-family: var(--font-mono);
  }
  table thead th {
    position: sticky;
    top: 0;
    background-color: white;
  }
  table tbody th {
    position: sticky;
    left: 0;
    background-color: white;
  }
</style>
