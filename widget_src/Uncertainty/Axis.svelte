<script>
  import { onDestroy, onMount } from "svelte";
  import { axisBottom, axisTop, axisLeft, axisRight, select, format } from "d3";
  import { dir_H, dir_V } from "./constant";
  import { writable } from "svelte/store";

  export let id,
    role,
    // scaleX,
    // scaleY,
    scales = writable({}),
    sizing,
    bootstrap = false;
  let axisFunction, axisElement, gridFunction, gridElement;
  let nominal_offset = 0,
    rotate = 0;
  function prep(scale) {
    axisFunction = undefined;
    axisElement = undefined;
    gridFunction = undefined;
    gridElement = undefined;
    nominal_offset = 0;
    rotate = 0;

    axisElement = select("#" + id + "-group");
    
    if (role === "x_axis") {
      axisFunction = axisBottom().scale(scale);
      if (sizing.dir === dir_H) {
        axisFunction.tickFormat(bootstrap ? format(".3") : format(",.0f"));

        gridFunction = axisTop().scale(scale);
        gridFunction.tickFormat((_) => null).tickSize(sizing.chart.height);
      } else if (sizing.dir === dir_V) {
        rotate = sizing.x_axis.rotate;
      }
    } else if (role === "y_axis") {
      axisFunction = axisLeft().scale(scale);
      if (sizing.dir === dir_H) {
      } else if (sizing.dir === dir_V) {
        axisFunction.tickFormat(bootstrap ? format(".3") : format(",.0f"));

        gridFunction = axisRight().scale(scale);
        gridFunction.tickFormat((_) => null).tickSize(sizing.chart.width);
      }
    }
    nominal_offset = sizing.chart.band_total_width / 2;

    axisElement.call(axisFunction);

    if (rotate) {
      axisElement
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.5em")
        .attr("dy", ".10em")
        .attr("transform", `rotate(${rotate})`);
    }

    if (gridFunction) {
      gridElement = select("#" + id + "-group-grid");
      gridElement.call(gridFunction);
    }
  }
  onMount(() => {
    scales.subscribe((sc) => {
      if (sc) {
        prep(role === "y_axis" ? sc?.y : sc?.x);
      }
    });
  });
</script>

{#key scales}
  {#if role === "x_axis" && sizing.dir === dir_H}
    <g
      id={id + "-group"}
      class={"axis " + role + " quantitative"}
      transform={`translate(${sizing[role].x} ${sizing[role].y})`}
    >
    </g>
    <g
      id={id + "-group-grid"}
      class={"grid " + role + " quantitative"}
      transform={`translate(${sizing[role].x} ${sizing[role].y})`}
    >
    </g>
  {:else if role === "y_axis" && sizing.dir === dir_H}
    <g
      id={id + "-group"}
      class={"axis " + role + " nominal"}
      transform={`translate(${sizing[role].x + sizing[role].width - 1} ${sizing[role].y + nominal_offset})`}
    >
    </g>
  {:else if role === "x_axis" && sizing.dir === dir_V}
    <g
      id={id + "-group"}
      class={"axis " + role + " nominal"}
      transform={`translate(${sizing[role].x + nominal_offset} ${sizing[role].y + 1})`}
    >
    </g>
  {:else if role === "y_axis" && sizing.dir === dir_V}
    <g
      id={id + "-group"}
      class={"axis " + role + " quantitative"}
      transform={`translate(${sizing[role].x + sizing[role].width} ${sizing[role].y})`}
    >
    </g>
    <g
      id={id + "-group-grid"}
      class={"grid " + role + " quantitative"}
      transform={`translate(${sizing[role].x + sizing[role].width} ${sizing[role].y})`}
    >
    </g>
  {/if}
{/key}
