<script>
  import { onMount } from "svelte";
  import Cart from "./Cart.svelte";
  import { titles, descriptions } from "./meta_info";
  import QubitEdge from "./QubitEdge.svelte";
  import QubitNode from "./QubitNode.svelte";
  import { writable } from "svelte/store";
  import { scaleSequential, interpolateMagma, mean, median } from "d3";
  import MiniStats from "./MiniStats.svelte";
  import { mouse_adj } from "./adjustment";
  export let key = "",
    qubit_edges,
    qubit_nodes,
    qubit_index,
    addToBasket,
    basket,
    level = 1,
    qubit_info,
    gate_info;

  const singleton_gates = ["id", "rz", "sx"];
  const dobule_gates = ["cx", "ecr"];

  let colorScale;
  let edgeColorScale;

  let node_map;
  let n_rows = 0,
    n_cols = 0;
  let qubit_radius = 30,
    qubit_gap = 45,
    edge_width = 15,
    padding = 20;
  let width = 0,
    height = 0;
  let qubit_info_list = [];
  let edge_info_list = [];
  let qubit_info_selected = writable(),
    edge_info_selected = writable();
  function get_sizing(qubit_nodes) {
    n_rows = Math.max(...(qubit_nodes?.map((d) => d.y) ?? [0])) + 1;
    n_cols = Math.max(...(qubit_nodes?.map((d) => d.x) ?? [0])) + 1;
    width = (n_cols - 1) * qubit_gap + padding * 2;
    height = n_rows * qubit_gap + padding * 2;

    node_map = {};
    if (qubit_nodes) {
      for (const node of qubit_nodes) {
        node_map[node.index] = node;
      }
    }
    if (qubit_info) {
      qubit_info_list = Object.keys(qubit_info[0])
        .filter((d) => d !== "index")
        .map((d) => {
          return { feature: d };
        });
    }
    let qincl = [],
      eincl = [];
    edge_info_list = [];
    gate_info.forEach((a) => {
      if (dobule_gates.includes(a.gate) && !eincl.includes(a.gate)) {
        edge_info_list.push({ gate: a.gate, type: "error" });
        edge_info_list.push({ gate: a.gate, type: "length" });
        eincl.push(a.gate);
      }
      if (singleton_gates.includes(a.gate) && !qincl.includes(a.gate)) {
        qubit_info_list.push({ gate: a.gate, type: "error" });
        qubit_info_list.push({ gate: a.gate, type: "length" });
        qincl.push(a.gate);
      }
    });
    qubit_info_selected.set(qubit_info_list[0]);
    edge_info_selected.set(edge_info_list[0]);
  }

  let qubit_info_values = [],
    edge_info_values = {},
    qubit_stats,
    edge_stats,
    circuitElemCartKey,
    circuitElemCartKeyHead,
    circuitElemCartKeyFoot;
  qubit_info_selected.subscribe((s) => {
    qubit_info_values = [];
    if (s?.feature) {
      qubit_info_values = qubit_info.map((d) => d[s.feature]);
      let vs = qubit_info_values.map((d) => d.value);
      let [min, max] = [Math.min(...vs), Math.max(...vs)];
      qubit_stats = {
        min,
        max,
        mean: mean(vs),
        median: median(vs),
        values: vs,
      };
      if (["frequency", "readout_error"].includes(s.feature)) {
        colorScale = scaleSequential(interpolateMagma).domain([max, min]);
      } else {
        colorScale = scaleSequential(interpolateMagma).domain([min, max]);
      }
    } else if (s?.gate) {
      qubit_info_values = gate_info
        .filter((d) => d.gate === s.gate)
        .map((d) => {
          d.qubit = d.qubits[0];
          return d;
        })
        .toSorted((a, b) => a.qubit - b.qubit);
      let vs = qubit_info_values.map(
        (d) => d.parameters["gate_" + s.type].value,
      );
      let [min, max] = [Math.min(...vs), Math.max(...vs)];
      qubit_stats = {
        min,
        max,
        mean: mean(vs),
        median: median(vs),
        values: vs,
      };
      colorScale = scaleSequential(interpolateMagma).domain([max, min]);
    }
  });
  edge_info_selected.subscribe((s) => {
    edge_info_values = {};
    if (s?.gate) {
      let gates_filtered = gate_info.filter((d) => d.gate === s.gate);
      gates_filtered.forEach((g) => {
        edge_info_values[g.qubits.join("-")] = g;
      });

      let vs = Object.keys(edge_info_values).map(
        (d) => edge_info_values[d].parameters["gate_" + s.type]?.value,
      );

      let [min, max] = [Math.min(...vs), Math.max(...vs)];
      edge_stats = {
        min,
        max,
        mean: mean(vs),
        median: median(vs),
        values: vs,
      };
      edgeColorScale = scaleSequential(interpolateMagma).domain([max, min]);
    }
  });

  // tooltip
  let showTooltip = false,
    tooltipX,
    tooltipY,
    forceTooltip = false,
    tooltipInfo = {};
  function openTooltip(e, item, key, value, id, qubits, force) {
    if (forceTooltip && !force) return;
    showTooltip = true;
    tooltipInfo = { item, key, value };
    forceTooltip = force;
    tooltipY = e.target.offsetTop + 100;
    Array.from(document.querySelectorAll(".circuit-element")).forEach(
      (elem) => {
        elem.style.outline = null;
      },
    );
    if (document.querySelector("#" + id)) {
      document.querySelector("#" + id).style.outline = "2px solid black";
    }

    if (key.feature === "T1") {
      circuitElemCartKeyHead = "backend.properties().t1(";
      circuitElemCartKeyFoot = ")";
    } else if (key.feature === "T2") {
      circuitElemCartKeyHead = "backend.properties().t2(";
      circuitElemCartKeyFoot = ")";
    } else if (key.feature === "frequency") {
      circuitElemCartKeyHead = "backend.properties().frequency(";
      circuitElemCartKeyFoot = ")";
    } else if (key.feature === "readout_error") {
      circuitElemCartKeyHead = "backend.properties().readout_error(";
      circuitElemCartKeyFoot = ")";
    } else if (key.feature === "readout_length") {
      circuitElemCartKeyHead = "backend.properties().readout_length(";
      circuitElemCartKeyFoot = ")";
    } else if (key.feature === "prob_meas0_prep1") {
      circuitElemCartKeyHead = "backend.properties().qubit_property(";
      circuitElemCartKeyFoot = `, "prob_meas0_prep1")`;
    } else if (key.feature === "prob_meas1_prep0") {
      circuitElemCartKeyHead = "backend.properties().qubit_property(";
      circuitElemCartKeyFoot = `, "prob_meas1_prep0")`;
    } else if (key.gate) {
      circuitElemCartKeyHead = `backend.properties().gate_${key.type}(${key.gate}, [`;
      circuitElemCartKeyFoot = "])";
    }

    circuitElemCartKey = `circuit_${key.gate ? key.gate + "_" + key.type : key.feature}_${qubits.join("_")} = ${circuitElemCartKeyHead}${qubits.join(",")}${circuitElemCartKeyFoot}`;
  }
  function moveTooltip(e) {
    if (showTooltip) {
      tooltipX = e.screenX - mouse_adj.x;
      tooltipY = e.screenY - mouse_adj.y;
    }
  }
  function hideTooltip(force) {
    if (!forceTooltip) showTooltip = false;
    if (force) {
      showTooltip = false;
      tooltipInfo = undefined;
      forceTooltip = false;
      Array.from(document.querySelectorAll(".circuit-element")).forEach(
        (elem) => {
          elem.style.outline = null;
        },
      );
    }
  }

  // init
  onMount(() => {
    get_sizing(qubit_nodes);
  });
</script>

<article>
  {#if addToBasket}
    <button
      class="basket"
      on:click={() => {
        addToBasket(key);
      }}
    >
      <Cart on={$basket.includes(key)}></Cart>
    </button>
  {/if}
  {#if level == 1}
    <h2>{titles[key]}</h2>
  {:else if level == 2}
    <h3>{titles[key]}</h3>
  {/if}

  <div class="controls">
    <div>
      <label for="qubit_rep"> For Qubits: </label>
      <select
        name="qubit_rep"
        id="qubit_rep"
        on:change={(e) => {
          qubit_info_selected.set(JSON.parse(e.target.value));
        }}
      >
        {#each qubit_info_list as item}
          <option value={JSON.stringify(item)}
            >{item.feature || item.gate}
            {item.gate ? "- " + item.type : ""}</option
          >
        {/each}
      </select>
      <div class="stats">
        {#if qubit_stats && colorScale}
          <MiniStats data={qubit_stats} {colorScale}></MiniStats>
        {/if}
      </div>
    </div>
    <div>
      <label for="edge_rep"> For Edges: </label>
      <select
        name="edge_rep"
        id="edge_rep"
        on:change={(e) => {
          edge_info_selected.set(JSON.parse(e.target.value));
        }}
      >
        {#each edge_info_list as item}
          <option value={JSON.stringify(item)}
            >{item.gate || item.feature}
            {item.gate ? "- " + item.type : ""}</option
          >
        {/each}
      </select>
      <div class="stats">
        {#if edge_stats && edgeColorScale}
          <MiniStats data={edge_stats} colorScale={edgeColorScale}></MiniStats>
        {/if}
      </div>
    </div>
  </div>
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div
    class="circuit-background-map"
    on:click={() => {
      hideTooltip(true);
    }}
  ></div>
  <div
    class="circuit"
    style={`width: ${width}px; height: ${height}px; padding-bottom: 3rem;`}
  >
    {#if qubit_edges && node_map}
      {#each qubit_edges as edge, ei}
        <QubitEdge
          {edge}
          edge_nodes={edge?.toSorted((a, b) => a - b).map((d) => node_map[d])}
          {qubit_gap}
          {edge_width}
          {padding}
          edge_info_value={(
            edge_info_values[edge.join("-")] ||
            edge_info_values[edge[1] + "-" + edge[0]]
          )?.parameters["gate_" + $edge_info_selected.type]}
          colorScale={edgeColorScale}
          edge_info_selected={$edge_info_selected}
          info_type={$edge_info_selected.type}
          {openTooltip}
          {hideTooltip}
          {moveTooltip}
        ></QubitEdge>
      {/each}
      {#each qubit_index as qi}
        <QubitNode
          qubit={qi}
          qubit_node={node_map[qi]}
          {qubit_gap}
          {edge_width}
          {padding}
          qubit_info_value={$qubit_info_selected.feature
            ? qubit_info_values[qi]
            : qubit_info_values[qi].parameters[
                "gate_" + $qubit_info_selected.type
              ]}
          info_type={$qubit_info_selected.type}
          {colorScale}
          qubit_info_selected={$qubit_info_selected}
          {openTooltip}
          {hideTooltip}
          {moveTooltip}
        ></QubitNode>
      {/each}
    {/if}
  </div>
  {#if descriptions[key]}
    <div class="desc">{descriptions[key]}</div>
  {/if}

  {#if showTooltip}
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <!-- svelte-ignore a11y-mouse-events-have-key-events -->
    <div class="tooltip" style={`right: 1rem; top: ${tooltipY}px;`}>
      <h5>
        {tooltipInfo.item}–{tooltipInfo.key.gate || tooltipInfo.key.feature}
        {tooltipInfo.key.type ? tooltipInfo.key.type : ""}
      </h5>

      <table>
        <tbody>
          <tr>
            <th>Value</th><td> {tooltipInfo.value.value}</td>
          </tr>
          <tr>
            <th>Date</th><td> {tooltipInfo.value.asof}</td>
          </tr>
          {#if tooltipInfo.value.unit}
            <tr>
              <th>Unit</th><td> {tooltipInfo.value.unit}</td>
            </tr>
          {/if}
        </tbody>
      </table>

      <div style="text-align: right;">
        {#if addToBasket}
          <button
            class="basket"
            on:click={() => {
              addToBasket(circuitElemCartKey);
            }}
          >
            <Cart on={$basket.includes(circuitElemCartKey)}></Cart>
          </button>
        {/if}
        <button
          class="close"
          on:click={() => {
            hideTooltip(true);
          }}
          ><svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-x"
            viewBox="0 0 16 16"
          >
            <path
              d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"
            />
          </svg>
        </button>
      </div>
    </div>
  {/if}
</article>

<style>
  article {
    position: relative;
    padding: 0.5rem;
    border: 1px solid #aaa;
    background-color: #fafafa;
    box-shadow: 2px 2px 0 0 rgba(0, 0, 0, 0.15);
    grid-column: span 6;
  }
  .basket,
  .close {
    position: absolute;
    padding: 0.25rem 0.5rem;
    appearance: none;
    border: 0;
    background-color: transparent;
    cursor: pointer;
    border-radius: 0.25rem;
    line-height: 100%;
    text-align: center;
  }
  .basket {
    top: 0.25rem;
    right: 0.25rem;
  }
  .basket:hover,
  .close:hover {
    background-color: rgba(0, 0, 0, 0.15);
  }
  .circuit {
    position: relative;
    padding-bottom: 2rem;
  }
  h2 {
    font-size: 0.9rem;
    font-weight: 600;
    margin: 0 0 0.5rem 0;
  }
  h3 {
    font-size: 0.9rem;
    font-weight: 600;
    margin: 0 0 0.5rem 0;
  }
  .desc {
    font-size: 0.85rem;
    color: #787878;
    margin-top: 0.5rem;
  }
  .controls {
    display: flex;
    column-gap: 1rem;
    padding: 0 2rem;
  }
  .controls > div {
    width: 330px;
  }
  .controls label {
    font-size: 0.9rem;
    margin-right: 0.25rem;
  }
  .controls select {
    font-size: 0.9rem;
    padding: 0.15rem;
    border: 1px solid #333;
    background-color: white;
    border-radius: 0.25rem;
  }

  .circuit-background-map {
    z-index: 0;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .tooltip {
    position: absolute;
    padding: 0.85rem 0.85rem 0.5rem 0.85rem;
    border: 1px solid #333;
    background-color: white;
    font-family: var(--font-mono);
    z-index: 300;
    line-height: 100%;
  }
  .tooltip h5 {
    margin: 0 0.25rem 0.75rem 0.25rem;
    padding: 0;
    font-size: 0.9rem;
    font-weight: 700;
    line-height: 100%;
  }
  .tooltip .close,
  .tooltip .basket {
    position: relative;
    top: 0;
    left: 0;
    padding: 0.25rem;
    width: 1.5rem;
    margin-top: 0.25rem;
    line-height: 100%;
  }
  .tooltip table {
    border-collapse: collapse;
    margin: 0;
  }
  .tooltip table th,
  .tooltip table td {
    padding: 0.25rem;
    font-family: var(--monospace);
  }
  .tooltip table th {
    font-size: 0.65rem !important;
    color: #999;
  }
  .tooltip table td {
    font-size: 0.9rem;
    color: #121212;
  }
</style>
