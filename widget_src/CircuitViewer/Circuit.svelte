<script>
  import { onMount } from "svelte";
  import { planDrawing } from "./svg_utils/plan_draw";
  import SvgWrap from "./svgs/SVGWrap.svelte";
  import { writable } from "svelte/store";
  export let circuit_data,
    is_original = true,
    match,
    id,
    matched_circuit_id,
    matched_machine_id,
    machine_moment_at = writable(),
    open_tool = () => {},
    filter_unused_qubits = true,
    unit_id;

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

  let drawPlan;
  onMount(() => {
    drawPlan = planDrawing(circuit_data, {
      show_moments: true,
      is_original,
      match,
      matched_circuit_id,
      this_circuit_id: id,
      matched_machine_id,
      filter_unused_qubits,
      unit_id,
    });
    machine_moment_at.subscribe((li) => {
      let g = document.querySelector(`#${id} #layer-${li}--group`);
      if (g) {
        let wrapper = document.querySelector("#" + id + "-wrapper");
        let sticky = document.querySelector("#" + id + "-sticky");

        let wrapper_x_origin = wrapper.getClientRects()[0]?.left;
        let wrapper_width = wrapper.getClientRects()[0]?.width;
        let sticky_width = sticky.getClientRects()[0]?.width;
        let g_x_pos =
          g.getClientRects()[0]?.left - wrapper_x_origin - sticky_width;
        let g_width = g.getClientRects()[0]?.width;

        if (g_x_pos < 0) {
          wrapper.scrollBy({
            top: 0,
            left: -wrapper_width / 3,
            behavior: "smooth",
          });
        } else if (g_x_pos + g_width > wrapper_width - sticky_width) {
          wrapper.scrollBy({
            top: 0,
            left: wrapper_width / 3,
            behavior: "smooth",
          });
        }
      }
    });
  });

  $: {
    drawPlan = planDrawing(circuit_data, {
      show_moments: true,
      is_original,
      match,
      matched_circuit_id,
      this_circuit_id: id,
      matched_machine_id,
      filter_unused_qubits,
      unit_id,
    });
  }
</script>

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
          <SvgWrap
            data={drawPlan.groups.phase_marker}
            {openTooltip}
            {closeTooltip}
            {moveTooltip}
          ></SvgWrap>
        {/if}
        {#if drawPlan.groups.qubit_group}
          <SvgWrap
            data={drawPlan.groups.qubit_group}
            {open_tool}
            {openTooltip}
            {closeTooltip}
            {moveTooltip}
          ></SvgWrap>
        {/if}
        {#if drawPlan.groups.esp_axis_group}
          <SvgWrap
            data={drawPlan.groups.esp_axis_group}
            {open_tool}
            {openTooltip}
            {closeTooltip}
            {moveTooltip}
          ></SvgWrap>
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
          <SvgWrap
            data={drawPlan.groups.phase_marker}
            {openTooltip}
            {closeTooltip}
            {moveTooltip}
          ></SvgWrap>
        {/if}
        {#if drawPlan.groups.moment_group}
          <SvgWrap
            data={drawPlan.groups.moment_group}
            {open_tool}
            {openTooltip}
            {closeTooltip}
            {moveTooltip}
          ></SvgWrap>
        {/if}
        {#if drawPlan.groups.qubit_group}
          <SvgWrap
            data={drawPlan.groups.qubit_group}
            {open_tool}
            {openTooltip}
            {closeTooltip}
            {moveTooltip}
          ></SvgWrap>
        {/if}
        {#if drawPlan.groups.circuit_line_group}
          <SvgWrap
            data={drawPlan.groups.circuit_line_group}
            {open_tool}
            {openTooltip}
            {closeTooltip}
            {moveTooltip}
          ></SvgWrap>
        {/if}
        {#if drawPlan.groups.circuit_group}
          <SvgWrap
            data={drawPlan.groups.circuit_group}
            {open_tool}
            {openTooltip}
            {closeTooltip}
            {moveTooltip}
          ></SvgWrap>
        {/if}
        {#if drawPlan.groups.esp_axis_group}
          <SvgWrap
            data={drawPlan.groups.esp_axis_group}
            {open_tool}
            {openTooltip}
            {closeTooltip}
            {moveTooltip}
          ></SvgWrap>
        {/if}
        {#if drawPlan.groups.esp_group}
          <SvgWrap
            data={drawPlan.groups.esp_group}
            {open_tool}
            {openTooltip}
            {closeTooltip}
            {moveTooltip}
          ></SvgWrap>
        {/if}
      </svg>
    </div>
  </div>
{/if}

{#if showTooltip}
  <!--  style={`top: ${tooltip_y}px; left: ${tooltip_x}px;`} -->
  <div class="g-tooltip">
    {@html tootlip_content}
  </div>
{:else}
  <div class="g-tooltip deactive">
    Click or hover to see details. Double-click for further details.
  </div>
{/if}

<style>
  .g-tooltip {
    /* position: fixed; */
    position: relative;
    left: 50%;
    width: fit-content;
    padding: 0.5rem;
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
  :global(.g-tooltip .item) {
    display: block;
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
</style>
