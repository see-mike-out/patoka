<script>
  import { onDestroy, onMount } from "svelte";
  import { dir_H, dir_V } from "./constant";

  export let id = "",
    index,
    state = "",
    datum = {},
    scaleX = () => {},
    scaleY = () => {},
    fill = "#000000",
    sizing = {},
    key = "",
    HOPS = false,
    HOPS_speed = 500,
    count_data = [];

  let quant_value,
    int_id,
    cnt = 0;
  function setHOPS(hops, speed) {
    cnt = 0;
    if (hops) {
      int_id = setInterval(() => {
        quant_value = count_data[cnt];
        cnt = (cnt + 1) % count_data.length;
      }, speed);
    } else {
      quant_value = datum[key];
    }
  }
  onMount(() => {
    setHOPS(HOPS, HOPS_speed);
  });
  onDestroy(() => {
    clearInterval(int_id);
  });
</script>

{#if sizing.dir === dir_V}
  <g
    class="mark-wrap"
    data-index={index}
    data-state={state}
    transform={`translate(${scaleX(state)} 0)`}
    width={sizing.chart.band_total_width}
  >
    <rect
      {id}
      data-index={index}
      data-state={state}
      class="mark dot"
      {fill}
      x={sizing.chart.band_total_width / 2}
      y={scaleY(quant_value)}
      width={sizing.chart.band_width}
      height={sizing.chart.rule_width}
      transform={`translate(-${sizing.chart.band_width / 2} -${sizing.chart.rule_width / 2})`}
    ></rect>
  </g>
{:else if sizing.dir === dir_H}
  <g
    class="mark-wrap"
    data-index={index}
    data-state={state}
    transform={`translate(0 ${scaleY(state)})`}
    height={sizing.chart.band_total_width}
  >
    <rect
      {id}
      data-index={index}
      data-state={state}
      class="mark dot"
      {fill}
      y={sizing.chart.band_total_width / 2}
      x={scaleX(quant_value)}
      height={sizing.chart.band_width}
      width={sizing.chart.rule_width}
      transform={`translate(-${sizing.chart.rule_width / 2} -${sizing.chart.band_width / 2})`}
    ></rect>
  </g>
{/if}
