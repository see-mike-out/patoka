<script>
  import { dir_H, dir_V } from "./constant";

  export let id = "",
    index,
    state = "",
    datum = {},
    scaleX = () => {},
    scaleY = () => {},
    fill = "#ffc400",
    sizing = {},
    show_info = () => {};
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
      class="mark bar"
      {fill}
      x={sizing.chart.band_gap}
      width={sizing.chart.band_width}
      height={sizing.chart.height - scaleY(datum.measure)}
      y={scaleY(datum.measure)}
      on:click={(e) => {
        show_info(datum);
      }}
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
      class="mark bar"
      {fill}
      y={sizing.chart.band_gap}
      height={sizing.chart.band_width}
      width={scaleX(datum.measure)}
      x={0}
      on:click={(e) => {
        show_info(datum);
      }}
    ></rect>
  </g>
{/if}
