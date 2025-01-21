<script>
  import { decideBlackWhite } from "./util";
  export let qubit,
    qubit_node,
    qubit_gap = 35,
    edge_width = 15,
    padding = 20,
    qubit_radius = 25,
    qubit_info_value,
    info_type,
    colorScale = () => {},
    openTooltip = () => {},
    hideTooltip = () => {},
    moveTooltip = () => {},
    qubit_info_selected;
</script>

{#if qubit !== undefined && qubit_node}
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <qubit-node
    id={"qubit-" + qubit}
    class="circuit-element"
    style={`top: ${padding * 2 + qubit_node.y * qubit_gap - qubit_radius / 2}px; 
    left: ${padding * 2 + qubit_node.x * qubit_gap - qubit_radius / 2}px;
    width: ${qubit_radius}px;
    height: ${qubit_radius}px;
    border-radius: ${qubit_radius / 2}px;
    font-size: ${qubit_radius * 0.55}px;
    padding-top: ${qubit_radius * 0.225}px;
    background-color: ${colorScale(qubit_info_value.value)};
    color: ${decideBlackWhite(colorScale(qubit_info_value.value))}`}
    on:mouseover={(e) => {
      e.preventDefault();
      openTooltip(
        e,
        "Qubit " + qubit,
        qubit_info_selected,
        qubit_info_value,
        "qubit-" + qubit,
        [qubit],
        false
      );
    }}
    on:focus={(e) => {
        console.log("/")
      e.preventDefault();
      openTooltip(
        e,
        "Qubit " + qubit,
        qubit_info_selected,
        qubit_info_value,
        "qubit-" + qubit,
        [qubit],
        true
      );
    }}
    on:click={(e) => {
      e.preventDefault();
      openTooltip(
        e,
        "Qubit " + qubit,
        qubit_info_selected,
        qubit_info_value,
        "qubit-" + qubit,
        [qubit],
        true
      );
    }}
    on:mouseout={(e) => {
      e.preventDefault();
      hideTooltip(false);
    }}
    on:blur={(e) => {
        console.log("/")
      e.preventDefault();
      hideTooltip(true);
    }}>{qubit}</qubit-node
  >
{/if}

<style>
  qubit-node {
    box-sizing: border-box;
    display: block;
    position: absolute;
    background-color: lightgray;
    font-family: var(--font-mono);
    text-align: center;
    line-height: 100%;
    border: 1px solid white;
    user-select: none;
  }
  qubit-node:hover {
    outline: 2px solid black;
  }
</style>
