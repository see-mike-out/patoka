<script>
  export let data = {};
</script>

{#if data}
  <text
    id={data.id}
    class={data._class}
    data-role={data.role}
    x={data.x}
    y={data.y}
    width={data.width}
    height={data.height}
    text-anchor={data["text-anchor"]}
    alignment-baseline={data["alignment-baseline"]}
    font-size={data["font-size"] || 12}
    font-weight={data["font-weight"]}
    font-style={data["font-style"]}
    fill={data.fill}
    transform={data.transform}
    stroke={data.stroke || "#000000"}
    stroke-width={data["stroke-width"] || 0}
  >
    {data.text}
  </text>
{/if}

<style>
  text {
    user-select: none;
  }
</style>
