<script>
  import { default_fill, defualt_color } from "../svg_utils/constants";

  export let data = {};
</script>

{#if data}
  <path
    id={data.id}
    class={data._class}
    data-role={data.role}
    d={data.path}
    stroke={data.stroke || defualt_color}
    stroke-width={data["stroke-width"] !== undefined ? data["stroke-width"] : 1}
    fill={data.fill || default_fill}
    fill-opacity={data["fill-opacity"] !== undefined ? data["fill-opacity"] : 1}
    transform={data.transform}
  >
  </path>
{/if}

<!-- x={data.x}
y={data.y}
width={data.width}
height={data.height} -->
