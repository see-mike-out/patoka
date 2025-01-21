<script>
  import { onMount } from "svelte";
  import { planDrawing } from "../../CircuitViewer/svg_utils/plan_draw";
  import SvgWrap from "../../CircuitViewer/svgs/SVGWrap.svelte";
  import { writable } from "svelte/store";

  export let panel_name = "Circuit",
    circuit_data,
    is_original = false,
    id = "circuit";

  let hide1 = writable(true);
  let pagination = writable({
    total_page: 0,
    page: 0,
    range: [0, 0],
  });

  let drawPlan,
    filter_unused_qubits = true;
  let qubit_registry = [],
    clbit_registry = [];
  function get_qubit_registry(data, type) {
    if (!data.layers) return [];
    // {index : 0, register :  {name: 'q', size: 127}}
    let temp_registry = [];
    for (const layer of data.layers) {
      for (const op of layer.operations) {
        for (const q of op[type]) {
          let qk = q.index + "___" + q.register.name + "___" + q.register.size;
          if (!temp_registry.includes(qk)) {
            temp_registry.push(qk);
          }
        }
      }
    }
    return temp_registry.map((d) => {
      let qks = d.split("___");
      return {
        index: parseInt(qks[0]),
        register: { name: qks[1], size: parseInt(qks[2]) },
      };
    });
  }

  function prepare(circuit_data, page_info) {
    if (!circuit_data.layers) {
      drawPlan = undefined;
      return;
    }
    qubit_registry = get_qubit_registry(circuit_data, "qubits");
    clbit_registry = get_qubit_registry(circuit_data, "clbits");
    circuit_data.qubits = qubit_registry;
    circuit_data.num_qubits = qubit_registry?.length;
    circuit_data.clbits = clbit_registry;
    circuit_data.num_clbits = clbit_registry?.length;
    drawPlan = planDrawing(circuit_data, {
      pagination: page_info,
      show_moments: true,
      is_original,
      filter_unused_qubits,
      no_match: true,
      first_layer_index: circuit_data.layer_index?.[0] || 0,
    });
  }
  const pagination_unit = 50;
  onMount(() => {
    pagination.subscribe((page_info) => {
      prepare(circuit_data, page_info);
    });
    let total_layers = circuit_data.layers?.length || 0;
    let total_pages = Math.ceil(total_layers / pagination_unit);
    pagination.set({
      total_layers,
      total_page: total_pages,
      page: 1,
      range: [0, Math.min(pagination_unit, total_layers)],
    });
    // prepare(circuit_data, $pagination);
  });

  $: {
    let total_layers = circuit_data.layers?.length || 0;
    let total_pages = Math.ceil(total_layers / pagination_unit);
    pagination.set({
      total_layers,
      total_page: total_pages,
      page: 1,
      range: [0, Math.min(pagination_unit, total_layers)],
    });
  }
  // $: {
  //   prepare(circuit_data, $pagination);
  // }

  function goToPage(pageNo) {
    pagination.update((p) => {
      p.page = Math.min(p.total_page, Math.max(1, pageNo));
      p.range = [
        Math.min(
          p.total_layers - 1,
          Math.max(0, (pageNo - 1) * pagination_unit),
        ),
        Math.min(p.total_layers - 1, Math.max(0, pageNo * pagination_unit)),
      ];
      console.log(p);
      return p;
    });
  }

  // tooltips
  let showTooltip = false,
    tooltip_x,
    tooltip_y,
    tootlip_content,
    clicked_tooltip = false,
    tooltip_priority = 999;

  function openTooltip(e, cont, clicked, priority) {
    if (clicked_tooltip && !clicked) return;
    if (tooltip_priority < priority) return;
    showTooltip = true;
    tooltip_x = e.clientX + 5;
    tooltip_y = e.clientY + 5;
    tootlip_content = cont;
    clicked_tooltip = clicked;
    tooltip_priority = priority ? priority : 0;
  }
  function moveTooltip(e) {
    if (showTooltip) {
      tooltip_x = e.clientX + 5;
      tooltip_y = e.clientY + 5;
    }
  }
  function closeTooltip(force) {
    if (!clicked_tooltip) showTooltip = false;
    if (force) {
      showTooltip = false;
      tooltip_priority = 999;
    }
  }
</script>

{#if circuit_data}
  <article class="panel">
    <h4>
      {panel_name}
      <button on:click={(e) => hide1.set(!$hide1)}
        >{$hide1 ? "Show" : "Hide"}</button
      >
      {#if !$hide1 && $pagination.total_page > 1}
        Showing layer
        <input
          type="number"
          min={1}
          max={$pagination.total_page}
          value={$pagination.page}
          on:change={(e) => {
            goToPage(parseInt(e.target.value));
          }}
        />
        ({$pagination.range
          .map((d) => (circuit_data.layer_index?.[0] || 0) + d)
          .join("...")}) / {$pagination.total_page}
        <button
          on:click={(e) => {
            goToPage($pagination.page - 1);
          }}
          disabled={$pagination.page <= 1}
        >
          &leftarrow; Prev
        </button>
        <button
          on:click={(e) => {
            goToPage($pagination.page + 1);
          }}
          disabled={$pagination.page > $pagination.total_page}
        >
          Next &rightarrow;
        </button>
      {/if}
    </h4>

    <div class="content-wrap">
      {#if !$hide1}
        {#if drawPlan}
          <div
            id={id + "-wrapper"}
            class="ciruit-view-wrapper"
            style="position: relative; width: 100%; overflow-x: scroll; overflow-y:hidden;"
          >
            <!-- todo: sticky -->
            <div
              class="circuit-sticky"
              style={`width: ${drawPlan.groups.qubit_group.x + drawPlan.groups.qubit_group.width}px; height:${drawPlan.height}px;`}
            >
              <svg
                id={id + "-sticky"}
                width={drawPlan.groups.qubit_group.x +
                  drawPlan.groups.qubit_group.width}
                height={drawPlan.height}
                viewBox={drawPlan.viewBox
                  .map((d, i) =>
                    i == 2
                      ? drawPlan.groups.qubit_group.x +
                        drawPlan.groups.qubit_group.width
                      : d,
                  )
                  .join(" ")}
              >
                <style>
                  g {
                    font-family: Iosevka;
                    font-size: 14px;
                  }
                </style>
                {#if drawPlan.groups.phase_marker}
                  <SvgWrap data={drawPlan.groups.phase_marker}></SvgWrap>
                {/if}
                {#if drawPlan.groups.qubit_group}
                  <SvgWrap data={drawPlan.groups.qubit_group}></SvgWrap>
                {/if}
                {#if drawPlan.groups.esp_axis_group}
                  <SvgWrap data={drawPlan.groups.esp_axis_group}></SvgWrap>
                {/if}
              </svg>
            </div>
            <div class="circuit-main">
              <svg
                {id}
                width={drawPlan.width}
                height={drawPlan.height}
                viewBox={drawPlan.viewBox.join(" ")}
              >
                <style>
                  g {
                    font-family: Iosevka;
                    font-size: 14px;
                  }
                </style>
                {#if drawPlan.groups.phase_marker}
                  <SvgWrap data={drawPlan.groups.phase_marker}></SvgWrap>
                {/if}
                {#if drawPlan.groups.moment_group}
                  <SvgWrap data={drawPlan.groups.moment_group}></SvgWrap>
                {/if}
                {#if drawPlan.groups.qubit_group}
                  <SvgWrap
                    data={drawPlan.groups.qubit_group}
                    {openTooltip}
                    {closeTooltip}
                    {moveTooltip}
                  ></SvgWrap>
                {/if}
                {#if drawPlan.groups.circuit_line_group}
                  <SvgWrap data={drawPlan.groups.circuit_line_group}></SvgWrap>
                {/if}
                {#if drawPlan.groups.circuit_group}
                  <SvgWrap
                    data={drawPlan.groups.circuit_group}
                    {openTooltip}
                    {closeTooltip}
                    {moveTooltip}
                  ></SvgWrap>
                {/if}
              </svg>
            </div>
          </div>
        {/if}
      {/if}
    </div>
    {#if !$hide1}
      <div class="tooltip-space">
        {#if showTooltip}
          <!-- style={`top: ${tooltip_y}px; left: ${tooltip_x}px;`} -->
          <div class="g-tooltip">
            {@html tootlip_content}
          </div>
        {:else}
          <div class="g-tooltip deactive">
            Hover or click an item to see details
          </div>
        {/if}
      </div>
    {/if}
  </article>
{/if}

<style>
  .panel {
    grid-column: span 3;
  }
  .ciruit-view-wrapper {
    /* display: flex; */
    position: relative;
    width: 100%;
  }
  .circuit-sticky {
    position: sticky;
    top: 0;
    left: 0;
    z-index: 9;
    background-color: #ffffff;
  }
  .circuit-main {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 0;
  }
  .tooltip-space {
    height: 6rem;
  }
  .g-tooltip {
    /* position: fixed; */
    position: relative;
    left: 50%;
    width: fit-content;
    padding: 0.5rem;
    margin-bottom: 0.5rem;
    background-color: #ffffff;
    border: 1px solid #000;
    font-family: iosevka;
    line-height: 100%;
    font-size: 0.9rem;
    z-index: 300;
    transform: translateX(-50%);
  }
  .g-tooltip.deactive {
    color: #999;
    border-color: #999;
  }
  :global(.g-tooltip th) {
    text-align: left;
  }
</style>
