<script>
  import { default_fill, defualt_color } from "../svg_utils/constants";

  export let data = {};
</script>

{#if data}
  <rect
    id={data.id}
    class={data._class}
    data-role={data.role}
    x={data.x}
    y={data.y}
    width={data.width}
    height={data.height}
    stroke={data.stroke || defualt_color}
    stroke-width={data["stroke-width"] !== undefined ? data["stroke-width"] : 1}
    fill={data.fill || default_fill}
    fill-opacity={data["fill-opacity"] !== undefined ? data["fill-opacity"] : 1}
    transform={data.transform}
  >
  </rect>
{/if}
