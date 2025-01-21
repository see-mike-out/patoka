<script>
  import { writable } from "svelte/store";
  import SvgWrap from "../../CircuitViewer/svgs/SVGWrap.svelte";

  export let drawPlan = writable(),
    id = "natural-number-view";

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

<div class="content-wrap">
  {#if $drawPlan?.groups}
    <div
      id={id + "-wrapper"}
      class="count-histogram-wrapper"
      style="position: relative; width: 100%; overflow-x: scroll; overflow-y:hidden;"
    >
      <div
        class="count-histogram-sticky"
        style={`width: ${$drawPlan.groups.y_axis_group.x + $drawPlan.groups.y_axis_group.width}px; height:${$drawPlan.height}px;`}
      >
        <svg
          id={id + "-sticky"}
          width={$drawPlan.groups.y_axis_group.x +
            $drawPlan.groups.y_axis_group.width}
          height={$drawPlan.height}
          viewBox={$drawPlan.viewBox
            .map((d, i) =>
              i == 2
                ? $drawPlan.groups.y_axis_group.x +
                  $drawPlan.groups.y_axis_group.width
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
          {#if $drawPlan.groups.y_axis_group}
            <SvgWrap data={$drawPlan.groups.y_axis_group}></SvgWrap>
          {/if}
        </svg>
      </div>
      <div class="count-histogram-main">
        <svg
          {id}
          width={$drawPlan.width}
          height={$drawPlan.height}
          viewBox={$drawPlan.viewBox.join(" ")}
        >
          <style>
            g {
              font-family: Iosevka;
              font-size: 14px;
            }
          </style>
          {#if $drawPlan.groups.y_axis_group}
            <SvgWrap data={$drawPlan.groups.y_axis_group}></SvgWrap>
          {/if}
          {#if $drawPlan.groups.y_grid_group}
            <SvgWrap data={$drawPlan.groups.y_grid_group}></SvgWrap>
          {/if}
          {#if $drawPlan.groups.bar_group}
            <SvgWrap
              data={$drawPlan.groups.bar_group}
              {openTooltip}
              {closeTooltip}
              {moveTooltip}
            ></SvgWrap>
          {/if}
          {#if $drawPlan.groups.x_axis_group}
            <SvgWrap data={$drawPlan.groups.x_axis_group}></SvgWrap>
          {/if}
        </svg>
      </div>
    </div>
  {/if}
</div>
<div class="tooltip-space">
  {#if showTooltip}
    <!-- style={`top: ${tooltip_y}px; left: ${tooltip_x}px;`} -->
    <div class="g-tooltip">
      {@html tootlip_content}
    </div>
  {:else}
    <div class="g-tooltip deactive">Hover or click an item to see details</div>
  {/if}
</div>

<style>
  .count-histogram-wrapper {
    /* display: flex; */
    position: relative;
    width: 100%;
  }
  .count-histogram-sticky {
    position: sticky;
    top: 0;
    left: 0;
    z-index: 9;
    background-color: #ffffff;
  }
  .count-histogram-main {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 0;
  }
  .tooltip-space {
    height: 5rem;
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
