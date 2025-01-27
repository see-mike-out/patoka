<script>
  import { dir_H, dir_V } from "./constant";

  export let id = "",
    index,
    state = "",
    datum = {},
    key = "",
    scaleX = () => {},
    scaleY = () => {},
    stroke = "#000000",
    sizing = {};
</script>

{#if sizing.dir === dir_V}
  <g
    class="interval-wrap"
    data-index={index}
    data-state={state}
    transform={`translate(${scaleX(state)} 0)`}
    width={sizing.chart.band_total_width}
  >
    <line
      {id}
      data-index={index}
      data-state={state}
      class="mark interval"
      {stroke}
      stroke-width="1"
      x1={sizing.chart.band_total_width / 2 - 0.5}
      x2={sizing.chart.band_total_width / 2 - 0.5}
      y1={scaleY(datum[key][0])}
      y2={scaleY(datum[key][1])}
    ></line>
  </g>
{:else if sizing.dir === dir_H}
  <g
    class="mark-wrap"
    data-index={index}
    data-state={state}
    transform={`translate(0 ${scaleY(state)})`}
    height={sizing.chart.band_total_width}
  >
    <line
      {id}
      data-index={index}
      data-state={state}
      class="mark interval"
      {stroke}
      stroke-width="1"
      y1={sizing.chart.band_total_width / 2 - 0.5}
      y2={sizing.chart.band_total_width / 2 - 0.5}
      x1={scaleX(datum[key][0])}
      x2={scaleX(datum[key][1])}
    ></line>
  </g>
{/if}
