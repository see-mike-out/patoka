<script>
  import { onMount } from "svelte";
  import { writable } from "svelte/store";
  import TimeMachineNudv from "./TimeMachineModal/TimeMachineNUDV.svelte";
  import TimeMachineGates from "./TimeMachineModal/TimeMachineGates.svelte";

  export let timeMachineData = writable(),
    closeTimeMachine = () => {},
    addToBasket,
    basket;
  onMount(() => {});
</script>

<div class="time-machine-fade" tabindex="-1">
  <div class="time-machine-modal">
    <h2>
      History of <code
        >{$timeMachineData.parentKey}.{$timeMachineData.title_key ||
          $timeMachineData.key}</code
      >

      <button
        class="close"
        on:click={() => {
          closeTimeMachine();
        }}>&times;</button
      >
    </h2>
    <div class="time-machine-body">
      {#if $timeMachineData.datatype === "nudv-map"}
        <TimeMachineNudv {addToBasket} {basket} {timeMachineData}
        ></TimeMachineNudv>
      {:else if $timeMachineData.datatype === "gates"}
        <TimeMachineGates {addToBasket} {basket} {timeMachineData}
        ></TimeMachineGates>{/if}
      <!-- <pre>
        {JSON.stringify($timeMachineData, null, 2)}
      </pre> -->
    </div>
  </div>
</div>

<style>
  .time-machine-fade {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9990;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
  }
  .time-machine-modal {
    position: absolute;
    top: 1rem;
    left: 50%;
    transform: translateX(-50%);
    width: 80%;
    max-height: calc(100% - 2rem);
    background-color: white;
    border: 1px solid #ddd;
    border-radius: 1rem;
    overflow-y: scroll;
  }
  .close {
    position: absolute;
    top: 1rem;
    right: 1rem;
    width: 1rem;
    height: 1rem;
    font-size: 1rem;
    line-height: 100%;
    appearance: none;
    border: 0;
    background-color: transparent;
    cursor: pointer;
    user-select: none;
    z-index: 330;
  }
  h2 {
    position: sticky;
    top: 0;
    margin: 0;
    padding: 1rem;
    font-size: 1.2rem;
    border-bottom: 1px solid #ddd;
    line-height: 100%;
    background-color: white;
    z-index: 320;
  }
  h2 code {
    background-color: #f0f0f0;
    padding: 0.35rem;
    border-radius: 0.5rem;
    color: #de002c;
  }
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
