<script>
  import { onDestroy, onMount } from "svelte";
  import { writable } from "svelte/store";
  import { get_size } from "./sizing";
  import { get_scales } from "./scales";
  import Dot from "./Dot.svelte";
  import Interval from "./Interval.svelte";
  import Axis from "./Axis.svelte";
  import ClickWrap from "./ClickWrap.svelte";
  import Legend from "./Legend.svelte";
  import { format, select, selectAll } from "d3";

  export let data = writable(),
    design = writable(),
    id;

  let sizing = writable(),
    scales = writable();
  let perc_format = format(".2%");

  function prepare(dt, ds) {
    if ((dt, ds)) {
      // size processing
      selectAll("svg .axis text").remove();
      sizing.set(get_size(dt, ds));
    }
    return {};
  }

  let redrawing = false;

  let show_info_box = false,
    info_point;
  function show_info(datum) {
    show_info_box = true;
    info_point = datum;
  }

  onMount(() => {
    data.subscribe((dt) => {
      redrawing = true;
      prepare(dt, $design);
      setTimeout(() => {
        redrawing = false;
      }, 100);
    });
    design.subscribe((ds) => {
      redrawing = true;
      prepare($data, ds);
      setTimeout(() => {
        redrawing = false;
      }, 100);
    });
    sizing.subscribe((s) => {
      redrawing = true;
      if (s) {
        scales.set(get_scales($data, $design, s));
      }
      setTimeout(() => {
        redrawing = false;
      }, 100);
    });
  });
  onDestroy(() => {
    selectAll("g.axis").remove();
  });
</script>

<div class="vis-flex-group">
  {#if !redrawing}
    <div class="vis-wrap">
      {#if $sizing && $data && $design && $scales}
        <svg
          {id}
          width={$sizing.width}
          height={$sizing.height}
          viewBox={$sizing.viewBox.join(" ")}
        >
          <style>
            .axis {
              font-family: Iosevka;
              font-size: 11px;
            }
            .legend {
              font-family: Iosevka;
              font-size: 12px;
            }
            .axis.nominal path.domain,
            .axis.nominal .tick line {
              stroke-width: 0;
            }
            .grid .tick line {
              stroke: #ccc;
            }
            .click-wrap:hover {
              fill: #ffd500;
              fill-opacity: 0.1;
            }
          </style>
          <!-- legend -->
          {#if $sizing.legend}
            <Legend id="legend" sizing={$sizing}></Legend>
          {/if}
          <!-- axis -->
          <Axis
            id={id + "-axis-x"}
            role="x_axis"
            {scales}
            sizing={$sizing}
            bootstrap={$data.metadata.bootstrap}
          ></Axis>
          <Axis
            id={id + "-axis-y"}
            role="y_axis"
            {scales}
            sizing={$sizing}
            bootstrap={$data.metadata.bootstrap}
          ></Axis>
          <!-- chart area -->
          <g
            id={id + "-chart"}
            width={$sizing.chart.width}
            height={$sizing.chart.height}
            transform={`translate(${$sizing.chart.x} ${$sizing.chart.y})`}
          >
            {#each Object.keys($data.data) as state, i}
              <Dot
                id={id + "-mark-" + state.replace(/s/gi, "_") + "-true"}
                index={i}
                {state}
                datum={$data.data[state]}
                key={$data.metadata.bootstrap ? "prob_measure" : "measure"}
                scaleX={$scales.x}
                scaleY={$scales.y}
                fill={$sizing.chart.true_color}
                sizing={$sizing}
              ></Dot>
              <Dot
                id={id + "-mark-" + state.replace(/s/gi, "_") + "-hypo"}
                index={i}
                {state}
                datum={$data.data[state]}
                key={$data.metadata.bootstrap ? "prob_mean" : "mean"}
                scaleX={$scales.x}
                scaleY={$scales.y}
                fill={$sizing.chart.hypo_color}
                sizing={$sizing}
                HOPS={$design.HOPS}
                HOPS_speed={$design.HOPS_speed}
                count_data={$data.metadata.bootstrap
                  ? $data.probs[state]
                  : $data.counts[state]}
              ></Dot>
              {#if !$design.HOPS}
                <Interval
                  id={id + "-interval-" + state.replace(/s/gi, "_")}
                  index={i}
                  {state}
                  datum={$data.data[state]}
                  key={$data.metadata.bootstrap ? "prob_interval" : "interval"}
                  scaleX={$scales.x}
                  scaleY={$scales.y}
                  stroke={$sizing.chart.interval_color}
                  sizing={$sizing}
                ></Interval>
              {/if}
              <ClickWrap
                id={id + "-mark-" + state.replace(/s/gi, "_") + "-click"}
                index={i}
                {state}
                datum={$data.data[state]}
                scaleX={$scales.x}
                scaleY={$scales.y}
                sizing={$sizing}
                {show_info}
              ></ClickWrap>
            {/each}
          </g>
        </svg>
      {/if}
    </div>
  {/if}
  {#if show_info_box && info_point}
    <div class="info-wrap">
      <div class="info-box">
        <table>
          <tbody>
            <tr>
              <th>State</th>
              <td>{info_point.state}</td>
            </tr>
            <tr>
              <th>Measured counts</th>
              <td
                >{info_point.measure} ({perc_format(
                  info_point.prob_measure,
                )})</td
              >
            </tr>
            <tr>
              <th>Error-adjusted count mean</th>
              <td>{info_point.mean} ({perc_format(info_point.prob_mean)})</td>
            </tr>
            <tr>
              <th>Error-adjusted interval</th>
              <td
                >[{info_point.interval.join(", ")}] ([{info_point.prob_interval
                  .map(perc_format)
                  .join(", ")}])</td
              >
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  {/if}
</div>

<style>
  * {
    box-sizing: border-box;
  }
  .info-wrap {
    margin-top: 1rem;
  }
  .info-box {
    width: fit-content;
    padding: 1rem;
    font-family: iosevka;
    border: 1px solid #000;
    font-size: 0.9rem;
  }
  table {
    text-align: left;
  }
  table th {
    font-weight: 600;
    padding-right: 0.5rem;
  }
  .vis-flex-group {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    column-gap: 1rem;
  }
</style>
