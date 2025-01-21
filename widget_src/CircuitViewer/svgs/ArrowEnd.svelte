<script>
  import { default_fill, defualt_color } from "../svg_utils/constants";

  export let data = {};
</script>

{#if data}
  <polygon
    id={data.id}
    class={data._class}
    data-role={data.role}
    points={`${data.x},${data.y - 6} ${data.x + 4},${data.y + 4} ${data.x - 4},${data.y + 4}`}
    stroke={data.stroke || defualt_color}
    stroke-width={data["stroke-width"] !== undefined ? data["stroke-width"] : 1}
    fill={data.fill || default_fill}
    fill-opacity={data["fill-opacity"] !== undefined ? data["fill-opacity"] : 1}
    transform={`rotate(${(data.rotate || 0) + 90})`}
    transform-origin={`${data.x} ${data.y}`}
  >
  </polygon>
{/if}
