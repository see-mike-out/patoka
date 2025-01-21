<script>
  import { defualt_color } from "../svg_utils/constants";

  export let data = {};
</script>

{#if data}
  <g id={data.id} class={data._class} data-role={data.role}>
    <line
      id={data.id + "-0"}
      x1={data.cx}
      y1={data.cy}
      x2={data.cx + data.width}
      y2={data.cy + data.height}
      stroke={data.stroke || defualt_color}
      stroke-width={data["stroke-width"] !== undefined
        ? data["stroke-width"]
        : 1}
      stroke-opacity={data["stroke-opacity"] !== undefined
        ? data["stroke-opacity"]
        : 1}
      transform={`translate(-${data.width / 2}, -${data.height/2})`}
    >
    </line>
  </g>
  <g id={data.id} class={data._class} data-role={data.role}>
    <line
      id={data.id + "-0"}
      x1={data.cx + data.width}
      y1={data.cy}
      x2={data.cx}
      y2={data.cy + data.height}
      stroke={data.stroke || defualt_color}
      stroke-width={data["stroke-width"] !== undefined
        ? data["stroke-width"]
        : 1}
      stroke-opacity={data["stroke-opacity"] !== undefined
        ? data["stroke-opacity"]
        : 1}
      transform={`translate(-${data.width / 2}, -${data.height/2})`}
    >
    </line>
  </g>
{/if}
