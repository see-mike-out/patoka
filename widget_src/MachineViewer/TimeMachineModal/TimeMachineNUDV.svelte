<script>
  import { onMount } from "svelte";
  import { writable } from "svelte/store";
  import Cart from "../Cart.svelte";
  import InTableBar from "./InTableBar.svelte";
  import { toPythonDatetime } from "../util";

  export let timeMachineData = writable(),
    addToBasket,
    basket;
  let maxValue = -Infinity,
    minValue = Infinity;
  let basket_codes = {};
  onMount(() => {
    maxValue =
      $timeMachineData.curr_data.value > maxValue
        ? $timeMachineData.curr_data.value
        : maxValue;

    minValue =
      $timeMachineData.curr_data.value < minValue
        ? $timeMachineData.curr_data.value
        : minValue;

    basket_codes.curr = `${$timeMachineData.key}_curr = ${$timeMachineData.code_header}${$timeMachineData.code_key}${$timeMachineData.code_footer}`;

    basket_codes.total = `${$timeMachineData.key}_timed = [${$timeMachineData.key}_curr`;
    let di = 0;
    for (let dp of $timeMachineData.history_data) {
      maxValue = dp.data.value > maxValue ? dp.data.value : maxValue;
      minValue = dp.data.value < minValue ? dp.data.value : minValue;
      basket_codes[di] =
        `${$timeMachineData.key}_h_${di} = ${$timeMachineData.code_header}${$timeMachineData.code_key}${$timeMachineData.code_footer}`;
      basket_codes[di] = basket_codes[di].replace(
        ".properties()",
        ".properties(datetime=" + toPythonDatetime(dp.date) + ")",
      );
      basket_codes.total += `, ${$timeMachineData.key}_h_${di}`;
      di++;
    }
    basket_codes.total += "]";
    minValue -= (maxValue - minValue) / 4;
  });
</script>

<div class="time-machine-body">
  <table>
    <thead>
      <tr>
        <th>Time point</th>
        <th>As of</th>
        <th>Value</th>
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
          {/if}</th
        >
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Current</td>
        <td>{$timeMachineData.curr_data.asof}</td>
        <td
          >{$timeMachineData.curr_data.value} ({$timeMachineData.curr_data
            .unit})</td
        >
        <td class="in-table-bar-cell">
          <InTableBar
            value={$timeMachineData.curr_data.value}
            min={minValue}
            max={maxValue}
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
          <td>{dp.data.asof}</td>
          <td>{dp.data.value} ({dp.data.unit})</td>
          <td class="in-table-bar-cell">
            <InTableBar value={dp.data.value} min={minValue} max={maxValue}
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
