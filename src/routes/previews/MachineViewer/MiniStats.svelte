<script>
  import { onMount } from "svelte";
  import { bin } from "d3";

  export let data = {},
    colorScale = () => {};
  let total_width = 200;
  let min, max, mean, median, values, bins, counts, max_count;
  const bar_height = 40;
  function process(_data) {
    min = _data.min;
    max = _data.max;
    mean = _data.mean;
    median = _data.median;
    values = _data.values;

    bins = bin().thresholds(20)(values);
    counts = bins.map((d) => d.length);
    max_count = Math.max(...counts);
  }
  let roundN = (n) => Math.round(n * 10000) / 10000;
  onMount(() => {
    process(data);
  });

  $: {
    process(data);
  }
</script>

<div style={`width: ${total_width}px; padding: `}>
  <div class="histogram-stats-wrap" style={`width: ${total_width}px`}>
    <span
      class="median"
      style={`left: ${((median - min) / (max - min)) * total_width}px; 
      transform: ${((median - min) / (max - min)) * total_width > 60 ? "translateX(-50%)" : ""};`}
      >Med: {roundN(mean)}</span
    >
  </div>
  <div class="histogram-wrap" style={`width: ${total_width}px`}>
    {#each counts as count, ci}
      <div
        class="histogram-bin"
        style={`width: ${total_width / counts.length - 1}px;
        height: ${(bar_height * count) / max_count}px;
        background-color: ${colorScale(bins[ci].x0)}`}
      ></div>
    {/each}
    <div
      class="median-marker"
      style={`left:${((median - min) / (max - min)) * total_width}px;`}
    ></div>
  </div>
  <div class="histogram-stats-wrap" style={`width: ${total_width}px`}>
    <span class="min">Min: {roundN(min)}</span>
    <span class="max">Max: {roundN(max)}</span>
  </div>
</div>

<style>
  * {
    box-sizing: border-box;
  }
  .histogram-wrap {
    position: relative;
    display: flex;
    align-items: flex-end;
    column-gap: 1px;
    padding-top: 0.5rem;
    padding-bottom: 0.25rem;
  }
  .histogram-bin {
    background-color: red;
  }
  .median-marker {
    position: absolute;
    width: 1px;
    height: 40px;
    top: 0.5rem;
    border-left: 1px solid #000;
  }
  .histogram-stats-wrap {
    position: relative;
    font-size: 0.6rem;
    height: 0.6rem;
    padding-bottom: 0.5rem;
  }
  .min {
    position: absolute;
    left: 0;
  }
  .max {
    position: absolute;
    right: 0;
  }
  .median {
    position: absolute;
    z-index: 300;
    background-color: rgba(255, 255, 255, 0.15);
  }
</style>
