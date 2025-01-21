<script>
  import { dir_H, dir_V } from "./constant";

  export let id = "",
    index,
    state = "",
    datum = {},
    scaleX = () => {},
    scaleY = () => {},
    sizing = {},
    show_info = () => {};
</script>

{#if sizing.dir === dir_V}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <g
    class="click-wrap"
    data-index={index}
    data-state={state}
    transform={`translate(${scaleX(state)} 0)`}
    width={sizing.chart.band_total_width}
  >
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <rect
      {id}
      data-index={index}
      data-state={state}
      class="click-wrap"
      fill="transparent"
      x={0}
      y={0}
      width={sizing.chart.band_total_width}
      height={sizing.chart.height}
      on:click={(e) => {
        show_info(datum);
      }}
    ></rect>
  </g>
{:else if sizing.dir === dir_H}
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <g
    class="mark-wrap"
    data-index={index}
    data-state={state}
    transform={`translate(0 ${scaleY(state)})`}
    height={sizing.chart.band_total_width}
  >
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <rect
      {id}
      data-index={index}
      data-state={state}
      class="click-wrap"
      fill="transparent"
      x={0}
      y={0}
      height={sizing.chart.band_total_width}
      width={sizing.chart.width}
      on:click={(e) => {
        show_info(datum);
      }}
    ></rect>
  </g>
{/if}
