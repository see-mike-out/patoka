<script>
  import { onMount } from "svelte";
  import { writable } from "svelte/store";
  import { schedule_pulse_data } from "./schedule_pulse_data";
  import { plan_pulse_view, _unit_dt } from "./svg_utils/draw_pulse_data";
  import SvgWrap from "./svgs/SVGWrap.svelte";
  import {
    circuit_h_gap,
    padding,
    pulse_y_axis_width,
  } from "./svg_utils/constants";
  import Line from "./svgs/Line.svelte";
  import Text from "./svgs/Text.svelte";

  export let id,
    transpiled_circuit_id,
    original_circuit_id,
    circuit_layers,
    pulse_data,
    machine_moment_at = writable(0),
    machine_dt_at = writable(0),
    op_schedule = writable([]),
    open_tool = () => {},
    autoplay = writable(false);

  let unit_dt = writable(10),
    pulse_row_height = writable(25);

  let pulse_schedule = writable([]),
    pulse_channels = {},
    drawPlan = writable();
  onMount(() => {
    pulse_schedule.subscribe((d) => {
      drawPlan.set(
        plan_pulse_view(d, pulse_channels, {
          unit_dt: $unit_dt,
          pulse_row_height: $pulse_row_height,
        }),
      );
    });

    unit_dt.subscribe((d) => {
      drawPlan.set(
        plan_pulse_view($pulse_schedule, pulse_channels, {
          unit_dt: d,
          pulse_row_height: $pulse_row_height,
        }),
      );
    });

    pulse_row_height.subscribe((d) => {
      drawPlan.set(
        plan_pulse_view($pulse_schedule, pulse_channels, {
          unit_dt: $unit_dt,
          pulse_row_height: d,
        }),
      );
    });

    let { schedule, channels, operation_schedule } = schedule_pulse_data(
      circuit_layers,
      pulse_data,
    );
    pulse_channels = channels;
    pulse_schedule.set(schedule);
    op_schedule.set(operation_schedule);

    machine_dt_at.subscribe((d) => {
      setTimeout(() => {
        let g = document.querySelector("#" + id + "-dt-marker");
        if (g) {
          let wrapper = document.querySelector("#" + id + "-wrapper");
          let sticky = document.querySelector("#" + id + "-sticky");

          let wrapper_x_origin = wrapper.getClientRects()[0]?.left;
          let wrapper_width = wrapper.getClientRects()[0]?.width;
          let sticky_width = sticky.getClientRects()[0]?.width;
          let g_x_pos =
            g.getClientRects()[0]?.left - wrapper_x_origin - sticky_width;
          let g_width = 2;

          if (g_x_pos < 0) {
            wrapper.scrollBy({
              top: 0,
              left: -wrapper_width / 3,
              behavior: $autoplay ? "instant" : "smooth",
            });
          } else if (g_x_pos + g_width > wrapper_width - sticky_width) {
            wrapper.scrollBy({
              top: 0,
              left: wrapper_width / 3,
              behavior: $autoplay ? "instant" : "smooth",
            });
          }
        }
      }, 50);
    });
  });
  $: {
    let { schedule, channels } = schedule_pulse_data(
      circuit_layers,
      pulse_data,
    );
    pulse_channels = channels;
    pulse_schedule.set(schedule);
  }

  let showViewControl = false,
    showPulseView = true;
</script>

<div>
  <h5>
    Pulse data view
    <button
      on:click={() => {
        showPulseView = !showPulseView;
      }}
    >
      {showPulseView ? "Hide" : "Show"} pulse data
    </button>
    <button
      on:click={() => {
        showViewControl = !showViewControl;
      }}
    >
      {showViewControl ? "Hide" : "Show"} view control
    </button>
  </h5>
  {#if showViewControl}
    <div class="sizing-options">
      <div class="sizing-button-wrap">
        <button disabled>Width: 1/{$unit_dt}</button>
        <button
          on:click={() => {
            unit_dt.update((d) => Math.min(d + 2, 20));
          }}
          alt="narrower"
        >
          &larr;
        </button>
        <button
          on:click={() => {
            unit_dt.update((d) => Math.max(d - 2, 1));
          }}
          alt="wider"
        >
          &rarr;
        </button>
        <button
          on:click={() => {
            unit_dt.set(_unit_dt);
          }}
        >
          &#x21BA;
        </button>
      </div>
      <div class="sizing-button-wrap">
        <button disabled>Height: {$pulse_row_height}</button>
        <button
          on:click={() => {
            pulse_row_height.update((d) => Math.max(d - 2, 10));
          }}
          alt="shallower"
        >
          &uarr;
        </button>
        <button
          on:click={() => {
            pulse_row_height.update((d) => Math.min(d + 2, 100));
          }}
          alt="deeper"
        >
          &darr;
        </button>
        <button
          on:click={() => {
            pulse_row_height.set(pulse_y_axis_width);
          }}
          alt="reset"
        >
          &#x21BA;
        </button>
      </div>
    </div>
  {/if}
</div>
<div class="pulse-vis-wrap" id={id + "-wrapper"}>
  {#if circuit_layers && pulse_data && $drawPlan && showPulseView}
    <div
      class="pulse-sticky"
      style={`width: ${padding + pulse_y_axis_width}px; height:${padding + $drawPlan.height}px;`}
    >
      <svg
        id={id + "-sticky"}
        class="sticky-axis"
        width={padding + pulse_y_axis_width}
        height={$drawPlan.height}
        viewBox={[0, 0, padding + pulse_y_axis_width, $drawPlan.height].join(
          " ",
        )}
      >
        <style>
          g {
            font-family: Iosevka;
            font-size: 14px;
          }
        </style>
        {#if $drawPlan.groups.axis_group}
          <SvgWrap data={$drawPlan.groups.axis_group} {open_tool}></SvgWrap>
        {/if}
      </svg>
    </div>
    <div class="pulse-main">
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
        {#if $drawPlan.groups.area_group}
          <SvgWrap data={$drawPlan.groups.area_group} {open_tool}></SvgWrap>
        {/if}
        <g>
          <Text
            data={{
              id: id + "-dt-marker-text",
              x:
                padding +
                pulse_y_axis_width +
                circuit_h_gap -
                1 +
                $drawPlan.scales?.dt_scale($machine_dt_at) +
                ($drawPlan.scales?.dt_scale($machine_dt_at) >
                $drawPlan.groups.area_group.width * 0.8
                  ? -5
                  : 5),
              y: 10,
              "font-size": 10,
              "alignment-baseline": "bottom",
              "text-anchor":
                $drawPlan.scales?.dt_scale($machine_dt_at) >
                $drawPlan.groups.area_group.width * 0.8
                  ? "end"
                  : "start",
              text:
                "Layer " + $machine_moment_at + "/" + $machine_dt_at + " (dt)",
            }}
          ></Text>
          <Line
            data={{
              id: id + "-dt-marker",
              x1:
                padding +
                pulse_y_axis_width +
                circuit_h_gap -
                1 +
                $drawPlan.scales?.dt_scale($machine_dt_at),
              x2:
                padding +
                pulse_y_axis_width +
                circuit_h_gap -
                1 +
                $drawPlan.scales?.dt_scale($machine_dt_at),
              y1: 0,
              y2: $drawPlan.height,
              "stroke-width": 2,
              stroke: "red",
              "stroke-opacity": 0.5,
              animate: { duration: 20, delay: 0 },
            }}
          ></Line>
        </g>
      </svg>
    </div>
  {/if}
</div>

<style>
  h5 {
    margin: 0 0 0.25rem 0;
    padding: 0;
    font-family: iosevka;
  }
  h5 button {
    appearance: none;
    margin: 0;
    padding: 0.25rem 0.5rem;
    line-height: 100%;
    border: 1px solid #ddd;
    border-radius: 0.25rem;
    background-color: transparent;
    cursor: pointer;
    font-family: iosevka;
  }
  .sizing-options {
    display: flex;
    column-gap: 0.25rem;
    row-gap: 0.25rem;
    flex-wrap: wrap;
  }
  .sizing-button-wrap {
    display: flex;
  }
  .sizing-button-wrap button {
    display: block;
    appearance: none;
    margin: 0;
    padding: 0.25rem 0.5rem;
    line-height: 100%;
    border-style: solid;
    border-color: #ddd;
    border-width: 1px 0 1px 1px;
    background-color: transparent;
    cursor: pointer;
    font-family: iosevka;
  }
  .sizing-button-wrap button:first-of-type {
    border-radius: 0.25rem 0 0 0.25rem;
  }
  .sizing-button-wrap button:last-of-type {
    border-right-width: 1px;
    border-radius: 0 0.25rem 0.25rem 0;
  }
  .sizing-button-wrap button:disabled {
    color: black;
    background-color: #f0f0f0;
  }
  .pulse-vis-wrap {
    position: relative;
    display: flex;
    width: 100%;
    overflow-x: scroll;
  }
  .pulse-sticky {
    position: sticky;
    top: 0;
    left: 0;
    z-index: 9;
    background-color: #ffffff;
  }
  .pulse-main {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 0;
  }
</style>
