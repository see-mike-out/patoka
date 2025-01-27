<script>
  export let id = "",
    sizing = {};
</script>

{#if sizing}
  <g
    class="legend"
    role="legend-group"
    {id}
    transform={`translate(${sizing.legend.x} ${sizing.legend.y})`}
  >
    <rect
      id={id + "-true"}
      fill={sizing.legend.true_color}
      x="0"
      y={(14 - sizing.legend.legend_rect_size) / 2 - 1}
      width={sizing.legend.legend_rect_size}
      height={sizing.legend.legend_rect_size}
    ></rect>
    <text
      x={sizing.legend.legend_rect_size + sizing.padding}
      y={14 / 2}
      alignment-baseline={"middle"}
    >
      Measure counts
    </text>

    <rect
      id={id + "-true"}
      fill={sizing.legend.hypo_color}
      x="0"
      y={(14 - sizing.legend.legend_rect_size) / 2 + 14 - 1}
      width={sizing.legend.legend_rect_size}
      height={sizing.legend.legend_rect_size}
    ></rect>

    <text
      x={sizing.legend.legend_rect_size + sizing.padding}
      y={14 / 2 + 14}
      alignment-baseline={"middle"}
    >
      Error-adjusted counts
    </text>
  </g>
{/if}
