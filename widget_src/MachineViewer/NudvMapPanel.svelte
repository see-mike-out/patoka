<script>
  import Cart from "./Cart.svelte";
  import Clock from "./Clock.svelte";
  import { titles, descriptions, markers } from "./meta_info";
  export let key = "",
    value,
    addToBasket,
    basket,
    level = 1,
    code_header = "",
    code_type = "",
    code_footer = "",
    parentKey = "",
    topLevelKey = "",
    openTimeMachine;
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
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Value</th>
          <th>Unit</th>
          <th>As of</th>
          <th>-</th>
          {#if topLevelKey === "properties" && openTimeMachine}
            <th>T</th>
          {/if}
        </tr>
      </thead>
      <tbody>
        {#each Object.keys(value) as key, ki}
          <tr>
            <th>{key}</th><td>{value[key].value}</td><td>{value[key].unit}</td
            ><td>{value[key].asof}</td>
            <td>
              {#if addToBasket}
                <button
                  class="basket"
                  on:click={() => {
                    addToBasket(
                      `${key}_${ki} = ${code_header}${key}${code_footer}`,
                    );
                  }}
                >
                  <Cart
                    on={$basket.includes(
                      `${key}_${ki} = ${code_header}${key}${code_footer}`,
                    )}
                  ></Cart>
                </button>
              {/if}
            </td>
            {#if topLevelKey === "properties" && openTimeMachine}
              <td>
                <button
                  class="basket"
                  on:click={() => {
                    openTimeMachine({
                      datatype: "nudv-map",
                      key,
                      title_key: key,
                      parentKey,
                      topLevelKey,
                      data: value[key],
                      code_header,
                      code_key: key,
                      code_footer,
                    });
                  }}
                >
                  <Clock></Clock>
                </button>
              </td>
            {/if}
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

  table button {
    z-index: 99;
  }

  table th {
    z-index: 999;
  }
</style>
