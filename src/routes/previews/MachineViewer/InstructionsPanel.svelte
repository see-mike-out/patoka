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
  let filter = {
      gates: [],
      qubits: [],
    },
    gates = [],
    qubits = [];
  onMount(() => {
    if (value) {
      gates = Array.from(new Set(value.map((d) => d.name)));
      qubits = Array.from(new Set(value.map((d) => d.qubits).flat()));
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
    <div class="filter-wrap">
      <!-- filter by gates -->
      <div>
        <label for="gates">Gates</label>
        <button
          on:click={(e) => {
            filter.gates = [];
          }}>&times;</button
        >
        <select
          class="filter"
          name="gates"
          id="gates"
          multiple
          on:change={(e) => {
            filter.gates = Array.from(e.target.selectedOptions).map(
              (x) => x.value,
            );
          }}
        >
          {#each gates as g}
            <option value={g} selected={filter.gates.includes(g)}>{g}</option>
          {/each}
        </select>
      </div>
      <div>
        <label for="qubits">Qubits</label>
        <button
          on:click={(e) => {
            filter.qubits = [];
          }}>&times;</button
        >
        <select
          class="filter"
          name="qubits"
          id="qubits"
          multiple
          on:change={(e) => {
            filter.qubits = Array.from(e.target.selectedOptions).map((x) =>
              parseInt(x.value),
            );
          }}
        >
          {#each qubits as g}
            <option value={g} selected={filter.qubits.includes(g)}>{g}</option>
          {/each}
        </select>
      </div>
      <!-- filter by qubits -->
    </div>
    <div class="value">
      <table>
        <thead>
          <tr>
            <th>Gate</th>
            <th>Qubits</th>
            <th>#Qubits</th>
            <th>#Clbits</th>
            <th>Duration</th>
            <th>Mutable?</th>
            <th>Params</th>
            <th>-</th>
          </tr>
        </thead>
        <tbody>
          {#each value as gate, gi}
            {#if (!filter.gates || filter.gates.length == 0 || (filter.gates && filter.gates.includes(gate.name))) && (!filter.qubits || filter.qubits.length == 0 || (filter.qubits && gate.qubits.some( (q) => filter.qubits.includes(q), )))}
              <tr>
                <th>{gate.name}</th>
                <td>{gate.qubits?.join(", ") || ""}</td>
                <td>{gate.num_qubits || ""}</td>
                <td>{gate.num_clbits || ""}</td>
                <td>{gate.duration || ""}</td>
                <td>{gate.mutable || ""}</td>
                <td>{gate.params?.join(", ") || ""}</td>

                <td>
                  {#if addToBasket}
                    <button
                      class="basket"
                      on:click={() => {
                        addToBasket(
                          `instruction_${gate.name}_${gate.qubits?.join(", ")} = ${code_header}x.name == "${gate.name}" and x.qubits == [${gate.qubits?.join(", ")}]${code_footer}`,
                        );
                      }}
                    >
                      <Cart
                        on={$basket.includes(
                          `instruction_${gate.name}_${gate.qubits?.join(", ")} = ${code_header}x.name == "${gate.name}" and x.qubits == [${gate.qubits?.join(", ")}]${code_footer}`,
                        )}
                      ></Cart>
                    </button>
                  {/if}
                </td>
              </tr>
            {/if}
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
  .content-wrap {
    display: flex;
    column-gap: 0.5rem;
  }
  .filter-wrap div {
    margin-bottom: 0.5rem;
  }
  .filter-wrap div label {
    font-size: 0.9rem;
    margin-bottom: 0.25rem;
  }
  .filter-wrap div button {
    appearance: none;
    border: 0;
    background-color: transparent;
    cursor: pointer;
    border-radius: 0.25rem;
    line-height: 100%;
  }
  .filter-wrap div button:hover {
    color: red;
    background-color: rgba(255, 0, 0, 0.05);
  }
  .filter {
    display: block;
    width: 60px;
    font-size: 0.9rem;
    font-family: var(--font-mono);
    border: 1px solid #ddd;
    border-radius: 0.25rem;
  }
</style>
