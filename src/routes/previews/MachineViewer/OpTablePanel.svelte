<script>
  import { onMount } from "svelte";
  import Cart from "./Cart.svelte";
  import { titles, descriptions, markers } from "./meta_info";
  export let key = "",
    value = [],
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
  <div class="content-wrap">
    <div class="value">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>#Qubits</th>
            <th>#ClBits</th>
            <th>Params</th>
            <th>Mutable?</th>
            <th>-</th>
          </tr>
        </thead>
        <tbody>
          {#each value as gate, gi}
            <tr>
              <th>{gate.name}</th>
              <td>{gate.type}</td>
              <td>{gate.num_qubits || ""}</td>
              <td>{gate.num_clbits || ""}</td>
              <td>{gate.params?.join(", ") || ""}</td>
              <td>{gate.mutable || ""}</td>
              <th>
                {#if addToBasket}
                  <button
                    class="basket"
                    on:click={() => {
                      addToBasket(
                        `op_${key}_${gate.name} = ${code_header}${gate.name}${code_footer}`,
                      );
                    }}
                  >
                    <Cart
                      on={$basket.includes(
                        `op_${key}_${gate.name} = ${code_header}${gate.name}${code_footer}`,
                      )}
                    ></Cart>
                  </button>
                {/if}
              </th>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
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
    grid-column: span 3;
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
  table .basket {
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
    font-size: 1.1rem;
    max-height: 200px;
    overflow-y: scroll;
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
    padding: 0.25rem 0.1rem;
  }
  thead th {
    background-color: white;
    position: sticky;
    top: -1px;
  }
</style>
