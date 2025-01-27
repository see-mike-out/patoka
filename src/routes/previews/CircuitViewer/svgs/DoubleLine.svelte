<script>
  import { onMount } from "svelte";
  import { defualt_color } from "../svg_utils/constants";

  export let data = {};
  let gap = 0;
  onMount(() => {
    gap = data["stroke-width"] !== undefined ? data["stroke-width"] : 1;
  });
</script>

{#if data}
  <line
    id={data.id + "--top"}
    class={data._class}
    data-role={data.role}
    x1={data.x1}
    y1={data.y1 - gap / 2}
    x2={data.x2 !== undefined ? data.x2 : data.x1}
    y2={(data.y2 !== undefined ? data.y2 : data.y1) - gap / 2}
    stroke={data.stroke || defualt_color}
    stroke-width={1}
  >
  </line>
  <line
    id={data.id + "--bottom"}
    class={data._class}
    data-role={data.role}
    x1={data.x1}
    y1={data.y1 + gap / 2}
    x2={data.x2 !== undefined ? data.x2 : data.x1}
    y2={(data.y2 !== undefined ? data.y2 : data.y1) + gap / 2}
    stroke={data.stroke || defualt_color}
    stroke-width={1}
  >
  </line>
{/if}
