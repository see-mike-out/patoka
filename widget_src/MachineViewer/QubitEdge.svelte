<script>
  export let edge,
    edge_nodes,
    qubit_gap = 35,
    edge_width = 20,
    padding = 20,
    edge_info_value,
    info_type,
    colorScale = () => {},
    openTooltip = () => {},
    hideTooltip = () => {},
    moveTooltip = () => {},
    edge_info_selected,
    is_used = false;
</script>

{#if edge && edge_nodes}
  {#if edge_nodes[0]?.x == edge_nodes[1]?.x}
    <!-- vertical -->
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <qubit-edge
      id={"edge-" + edge.join("-")}
      class="circuit-element v"
      style={`top: ${padding * 2 + edge_nodes[0]?.y * qubit_gap}px;
      width: ${edge_width}px; 
      height: ${Math.abs(edge_nodes[0]?.y - edge_nodes[1]?.y) * qubit_gap}px;
      left: ${padding * 2 + edge_nodes[0]?.x * qubit_gap - edge_width / 2}px;
      background-color: ${colorScale(edge_info_value?.value)};` +
        (is_used ? "box-shadow: 0 0 5px purple;" : "")}
      on:mouseover={(e) => {
        openTooltip(
          e,
          "Edge " + edge.join("-"),
          edge_info_selected,
          edge_info_value,
          "edge-" + edge.join("-"),
          edge,
          false,
        );
      }}
      on:focus={(e) => {
        openTooltip(
          e,
          "Edge " + edge.join("-"),
          edge_info_selected,
          edge_info_value,
          "edge-" + edge.join("-"),
          edge,
          true,
        );
      }}
      on:click={(e) => {
        openTooltip(
          e,
          "Edge " + edge.join("-"),
          edge_info_selected,
          edge_info_value,
          "edge-" + edge.join("-"),
          edge,
          true,
        );
      }}
      on:mouseout={(e) => {
        hideTooltip(false);
      }}
      on:blur={(e) => {
        hideTooltip(true);
      }}
    ></qubit-edge>
  {:else}
    <!-- horizontal -->
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <qubit-edge
      id={"edge-" + edge.join("-")}
      class="circuit-element h"
      style={`top: ${padding * 2 + edge_nodes[0]?.y * qubit_gap - edge_width / 2}px; 
      height: ${edge_width}px;
      width: ${Math.abs(edge_nodes[0]?.x - edge_nodes[1]?.x) * qubit_gap}px; 
      left: ${padding * 2 + edge_nodes[0]?.x * qubit_gap}px;
      background-color: ${colorScale(edge_info_value?.value)};` +
        (is_used ? "box-shadow: 0 0 5px purple;" : "")}
      on:mouseover={(e) => {
        openTooltip(
          e,
          "Edge " + edge.join("-"),
          edge_info_selected,
          edge_info_value,
          "edge-" + edge.join("-"),
          edge,
          false,
        );
      }}
      on:focus={(e) => {
        openTooltip(
          e,
          "Edge " + edge.join("-"),
          edge_info_selected,
          edge_info_value,
          "edge-" + edge.join("-"),
          edge,
          true,
        );
      }}
      on:click={(e) => {
        openTooltip(
          e,
          "Edge " + edge.join("-"),
          edge_info_selected,
          edge_info_value,
          "edge-" + edge.join("-"),
          edge,
          true,
        );
      }}
      on:mouseout={(e) => {
        hideTooltip(false);
      }}
      on:blur={(e) => {
        hideTooltip(true);
      }}
    >
    </qubit-edge>
  {/if}
{/if}

<style>
  qubit-edge {
    box-sizing: border-box;
    display: block;
    position: absolute;
    background-color: gray;
    font-size: 0.4rem;
    color: white;
    border: 1px solid white;
  }
  qubit-edge:hover {
    outline: 2px solid black;
  }
</style>
