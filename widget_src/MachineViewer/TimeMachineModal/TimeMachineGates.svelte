<script>
  import { onMount } from "svelte";
  import { writable } from "svelte/store";
  import Cart from "../Cart.svelte";
  import InTableBar from "./InTableBar.svelte";
  import { toPythonDatetime } from "../util";

  export let timeMachineData = writable(),
    addToBasket,
    basket;
  let maxValue = [-Infinity, -Infinity],
    minValue = [Infinity, Infinity];
  let basket_codes = {};
  onMount(() => {
    let g = [
      $timeMachineData.curr_data.parameters.gate_error.value,
      $timeMachineData.curr_data.parameters.gate_length.value,
    ];
    maxValue = [
      g[0] > maxValue[0] ? g[0] : maxValue[0],
      g[1] > maxValue[1] ? g[1] : maxValue[1],
    ];
    minValue = [
      g[0] < minValue[0] ? g[0] : minValue[0],
      g[1] < minValue[1] ? g[1] : minValue[1],
    ];
    basket_codes.curr = `gate_${$timeMachineData.curr_data.gate}_${$timeMachineData.curr_data.qubits.join("_")}_curr = ${$timeMachineData.code_header}gate=${$timeMachineData.curr_data.gate}, qubits=[${$timeMachineData.curr_data.qubits.join(", ")}]${$timeMachineData.code_footer}`;
    basket_codes.total = `gate_${$timeMachineData.key}_timed = [gate_${$timeMachineData.curr_data.gate}_${$timeMachineData.curr_data.qubits.join("_")}_curr`;
    let di = 0;
    for (let dp of $timeMachineData.history_data) {
      let f = [
        dp.data.parameters.gate_error.value,
        dp.data.parameters.gate_length.value,
      ];
      maxValue = [
        f[0] > maxValue[0] ? f[0] : maxValue[0],
        f[1] > maxValue[1] ? f[1] : maxValue[1],
      ];
      minValue = [
        f[0] < minValue[0] ? f[0] : minValue[0],
        f[1] < minValue[1] ? f[1] : minValue[1],
      ];
      basket_codes[di] =
        `gate_${dp.data.gate}_${dp.data.qubits.join("_")}_h_${di} = ${$timeMachineData.code_header.replace("properties()", "properties(datetime=" + toPythonDatetime(dp.date) + ")")}gate=${dp.data.gate}, qubits=[${dp.data.qubits.join(", ")}]${$timeMachineData.code_footer}`;
      basket_codes.total += `, gate_${dp.data.gate}_${dp.data.qubits.join("_")}_h_${di}`;
      di++;
    }
    minValue[0] -= (maxValue[0] - minValue[0]) / 4
    minValue[1] -= (maxValue[1] - minValue[1]) / 4
    basket_codes.total += "]";
  });
</script>

<div class="time-machine-body">
  <table>
    <thead>
      <tr>
        <th>Time point</th>
        <th>As of</th>
        <th>Error</th>
        <th>&rightarrow;</th>
        <th>As of</th>
        <th>Length</th>
        <th>&rightarrow;</th>
        <th>
          {#if addToBasket}
            <button
              class="basket"
              on:click={() => {
                if (!$basket.includes(basket_codes.total)) {
                  if (!$basket.includes(basket_codes.curr))
                    addToBasket(basket_codes.curr);
                  let di = 0;
                  for (let dp of $timeMachineData.history_data) {
                    if (!$basket.includes(basket_codes[di]))
                      addToBasket(basket_codes[di]);
                    di++;
                  }
                } else {
                  if ($basket.includes(basket_codes.curr))
                    addToBasket(basket_codes.curr);
                  let di = 0;
                  for (let dp of $timeMachineData.history_data) {
                    if ($basket.includes(basket_codes[di]))
                      addToBasket(basket_codes[di]);
                    di++;
                  }
                }
                addToBasket(basket_codes.total);
              }}
            >
              <Cart on={$basket.includes(basket_codes.total)}></Cart>
            </button>
          {/if}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Current</td>
        <td>{$timeMachineData.curr_data.parameters.gate_error.asof}</td>
        <td>{$timeMachineData.curr_data.parameters.gate_error.value}</td>
        <td class="in-table-bar-cell">
          <InTableBar
            value={$timeMachineData.curr_data.parameters.gate_error.value}
            min={minValue[0]}
            max={maxValue[0]}
          ></InTableBar>
        </td>

        <td>{$timeMachineData.curr_data.parameters.gate_length.asof}</td>
        <td
          >{$timeMachineData.curr_data.parameters.gate_length.value}
          ({$timeMachineData.curr_data.parameters.gate_length.unit})
        </td>
        <td class="in-table-bar-cell">
          <InTableBar
            value={$timeMachineData.curr_data.parameters.gate_length.value}
            min={minValue[1]}
            max={maxValue[1]}
              color="hotpink"
          ></InTableBar>
        </td>

        <td>
          {#if addToBasket}
            <button
              class="basket"
              on:click={() => {
                addToBasket(basket_codes.curr);
                if (
                  !$basket.includes(basket_codes.curr) &&
                  $basket.includes(basket_codes.total)
                ) {
                  addToBasket(basket_codes.total);
                }
              }}
            >
              <Cart on={$basket.includes(basket_codes.curr)}></Cart>
            </button>
          {/if}</td
        >
      </tr>
      {#each $timeMachineData.history_data as dp, di}
        <tr>
          <td>{dp.date}</td>

          <td>{dp.data.parameters.gate_error.asof}</td>
          <td>{dp.data.parameters.gate_error.value} </td>
          <td class="in-table-bar-cell">
            <InTableBar
              value={dp.data.parameters.gate_error.value}
              min={minValue[0]}
              max={maxValue[0]}
            ></InTableBar>
          </td>

          <td>{dp.data.parameters.gate_length.asof}</td>
          <td
            >{dp.data.parameters.gate_length.value}
            ({dp.data.parameters.gate_length.unit})
          </td>
          <td class="in-table-bar-cell">
            <InTableBar
              value={dp.data.parameters.gate_length.value}
              min={minValue[1]}
              max={maxValue[1]}
              color="hotpink"
            ></InTableBar>
          </td>

          <td>
            {#if addToBasket}
              <button
                class="basket"
                on:click={() => {
                  addToBasket(basket_codes[di]);
                  if (
                    !$basket.includes(basket_codes[di]) &&
                    $basket.includes(basket_codes.total)
                  ) {
                    addToBasket(basket_codes.total);
                  }
                }}
              >
                <Cart on={$basket.includes(basket_codes[di])}></Cart>
              </button>
            {/if}
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<style>
  .time-machine-body {
    position: relative;
    padding: 1rem;
    overflow-y: scroll;
    z-index: 300;
  }

  table {
    font-size: 0.9rem;
    font-family: var(--font-mono);
    text-align: left;
    border-collapse: collapse;
  }
  table td,
  table th {
    border: 1px solid #ddd;
    padding: 0.25rem;
    line-height: 100%;
  }
  .in-table-bar-cell {
    width: 100px;
  }
  .in-table-bar {
    background-color: dodgerblue;
    height: 0.9rem;
  }
  .basket {
    position: relative;
    top: 0;
    right: 0;
    padding: 0;
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
</style>
