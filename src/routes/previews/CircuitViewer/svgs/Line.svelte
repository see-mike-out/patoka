<script>
  import { defualt_color } from "../svg_utils/constants";

  export let data = {};
</script>

{#if data}
  <line
    id={data.id}
    class={data._class}
    data-role={data.role}
    x1={data.x1}
    y1={data.y1}
    x2={data.x2 !== undefined ? data.x2 : data.x1}
    y2={data.y2 !== undefined ? data.y2 : data.y1}
    stroke={data.stroke || defualt_color}
    stroke-width={data["stroke-width"] !== undefined ? data["stroke-width"] : 1}
    stroke-opacity={data["stroke-opacity"] !== undefined
      ? data["stroke-opacity"]
      : 1}
    stroke-dasharray={data["stroke-dasharray"] ?? ""}
  >
  </line>
{/if}
