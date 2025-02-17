<script>
  import { onMount } from "svelte";
  import { writable } from "svelte/store";
  import { plan_count_histogram } from "../draw_count_histogram";
  import SvgWrap from "../../CircuitViewer/svgs/SVGWrap.svelte";
  import { getSVGimageLink } from "../../CircuitViewer/svg_utils/util";

  export let data = writable(),
    id = "count-histogram";

  let hide1 = writable(true);
  let drawPlan = writable();
  let config = writable({
    reverse_state_vector: true,
    see_uncertainty: true,
  });

  onMount(() => {
    // count_data_to_show = get_count_range($data?.counts);
    drawPlan.set(
      plan_count_histogram($data?.counts, $data.uncertainty_data, $config),
    );

    config.subscribe((c) => {
      drawPlan.set(
        plan_count_histogram($data?.counts, $data.uncertainty_data, c),
      );
    });

    data.subscribe((d) => {
      drawPlan.set(
        plan_count_histogram(d?.counts, d.uncertainty_data, $config),
      );
    });
  });

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

  // images
  let images = {};
  let images_loader = writable();
  images_loader.subscribe((d) => {
    if (d) {
      images[d.id] = d;
    }
  });
</script>

{#if $data}
  <article class="panel">
    <h4>
      Counts with hypothetical error adjustment
      <button on:click={(e) => hide1.set(!$hide1)}
        >{$hide1 ? "Show" : "Hide"}</button
      >
      <button
        class="save-make"
        on:click={(e) => {
          getSVGimageLink("count-histogram", images_loader);
        }}>Image</button
      >
      {#if images["count-histogram"]}
        <a class="save-download" href={images["count-histogram"].png} download
          >PNG</a
        >
        <a class="save-download" href={images["count-histogram"].svg} download
          >SVG</a
        >
      {/if}
    </h4>
    <div class="content-wrap">
      {#if !$hide1}
        <div class="input-wrap">
          <input
            id="config"
            type="checkbox"
            checked={$config?.reverse_state_vector}
            on:change={(e) => {
              config.update((c) => {
                c.reverse_state_vector = e.target.checked;
                return c;
              });
            }}
          />
          <label for="config">
            {#if $config?.reverse_state_vector}
              The bitstring is reversed (Qubit 0 &rightarrow; Qubit N).
            {:else}
              The bitstring is original (Qubit N &leftarrow; Qubit 0).
            {/if}
          </label>
        </div>
        <div class="input-wrap">
          <input
            id="config2"
            type="checkbox"
            checked={$config?.see_uncertainty}
            on:change={(e) => {
              config.update((c) => {
                c.see_uncertainty = e.target.checked;
                return c;
              });
            }}
          />
          <label for="config2">
            {#if $config?.see_uncertainty}
              Hypothetical Error-Adjsutmen (HEA) turned on
            {:else}
              Hypothetical Error-Adjsutmen (HEA) turned off
            {/if}
          </label>
        </div>
      {/if}
    </div>
    <div class="content-wrap">
      {#if !$hide1}
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
                {#if $drawPlan.groups.legend_group}
                  <SvgWrap data={$drawPlan.groups.legend_group}></SvgWrap>
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
    grid-column: span 6;
  }
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
    /* background-color: #ffffff; */
  }
  .count-histogram-main {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 0;
  }
  .tooltip-space {
    height: 10rem;
  }
  :global(.click-wrap:hover) {
    fill: rgba(0, 0, 0, 0.1);
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

  .note {
    font-size: 0.8rem;
    color: #999;
    margin: 0.5rem;
  }

  .save-make,
  .save-download {
    appearance: none;
    display: inline-block;
    font-size: 0.8rem;
    text-decoration: none;
    margin-left: 0.25rem;
    color: #454545;
    border: 0;
    padding: 0;
    background-color: transparent;
    cursor: pointer;
  }
  .save-make:hover,
  .save-download:hover {
    outline: 2px solid orange;
  }

  .input-wrap {
    margin: 0.5rem 0 0 0;
    padding: 0;
  }
  .input-wrap label {
    font-family: iosevka;
    font-size: 0.9rem;
  }
</style>
