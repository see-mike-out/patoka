<script>
  import { onMount } from "svelte";
  import { draw_mini_pulse_data } from "../svg_utils/draw_mini_pulse_view";
  import SvgWrap from "../svgs/SVGWrap.svelte";
  import { writable } from "svelte/store";
  import { getSVGimageLink } from "../svg_utils/util";

  export let info;
  let pulse_vis = writable();
  let images = {};
  let images_loader = writable();
  images_loader.subscribe((d) => {
    if (d) {
      images[d.id] = d;
    }
  });
  onMount(() => {
    if (info?.pulse_data?.pulse_schedule) {
      pulse_vis.set(draw_mini_pulse_data(info.pulse_data.pulse_schedule));
    }
  });
  $: {
    if (info?.pulse_data?.pulse_schedule) {
      pulse_vis.set(draw_mini_pulse_data(info.pulse_data.pulse_schedule));
    }
  }
</script>

{#if info}
  <div>
    <h2>
      Pulse for '{info.operation.gate}' gate on qubits ({info.operation.qubit_index?.join(
        ", ",
      )})
    </h2>
    <div class="info-section">
      <table>
        <tbody>
          <tr><th>Duration</th><td>{info.pulse_data.duration}</td></tr>
        </tbody>
      </table>
      {#if $pulse_vis}
        <h3>
          Pulse amplitude <button
            class="save-make"
            on:click={(e) => {
              getSVGimageLink("mini-pulse-view", images_loader);
            }}>Image</button
          >
          {#if images["mini-pulse-view"]}
            <a
              class="save-download"
              href={images["mini-pulse-view"].png}
              download>PNG</a
            >
            <a
              class="save-download"
              href={images["mini-pulse-view"].svg}
              download>SVG</a
            >
          {/if}
        </h3>
        <div class="mini-pulse-view">
          <svg
            id="mini-pulse-view"
            width={$pulse_vis.width}
            height={$pulse_vis.height}
            viewBox={$pulse_vis.viewBox.join(" ")}
          >
            <style>
              g {
                font-family: Iosevka;
                font-size: 14px;
              }
            </style>
            {#if $pulse_vis.groups.area_group}
              <SvgWrap data={$pulse_vis.groups.area_group}></SvgWrap>
            {/if}
          </svg>
        </div>
      {/if}
      <h3>Schedules</h3>
      <div class="schedule-table-wrap">
        <table>
          <thead>
            <tr>
              <th>At</th>
              <th>Duration</th>
              <th>Comp</th>
              <th>Channel</th>
              <th>Amp.</th>
              <th>Params</th>
            </tr>
          </thead>
          <tbody>
            {#each info.pulse_data.pulse_schedule as sched}
              <tr>
                <td>{sched.time_at}</td>
                <td>{sched.duration}</td>
                <td>{sched.component_type}</td>
                <td>{sched.channel_type}</td>
                <td>{sched.amplitude !== undefined ? sched.amplitude : ""}</td>
                <td>
                  {#if sched.phase}Phase ({sched.phase}){/if}
                  {#if sched.angle}Angle ({sched.angle}){/if}
                  {#if sched.sigma}Sigma ({sched.sigma}){/if}
                  {#if sched.beta}Beta ({sched.beta}){/if}
                  {#if sched.freq}Freq ({sched.freq}){/if}
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  </div>
{/if}

<style>
  h2 {
    margin: 0;
    padding: 0.25rem 0.5rem;
    font-size: 0.85rem;
    border-bottom: 1px solid #ddd;
    line-height: 100%;
  }
  h3 {
    margin: 0;
    padding: 0.25rem 0.5rem;
    font-size: 0.85rem;
    font-weight: 500;
    font-style: italic;
    border-top: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
    line-height: 100%;
  }

  .info-section {
    padding: 0;
  }
  .schedule-table-wrap {
    overflow-x: scroll;
  }
  table {
    width: 100%;
    font-family: iosevka;
    border-collapse: collapse;
    border-radius: 0.5rem;
  }
  table th,
  table td {
    border-bottom: 1px solid #ddd;
    padding: 0.35rem 0.5rem;
    text-align: left;
    border-right: 1px solid #ddd;
  }
  table th:last-of-type,
  table td:last-of-type {
    border-right: 0;
  }
  table tbody tr:last-of-type th,
  table tr:last-of-type td {
    border-bottom: 0;
  }
  button,
  a.save-download {
    appearance: none;
    margin: 0;
    padding: 0.25rem 0.5rem;
    line-height: 100%;
    border-style: solid;
    border-color: #ddd;
    border-width: 1px;
    background-color: transparent;
    cursor: pointer;
    font-family: iosevka;
    border-radius: 0.25rem;
    color: black;
    font-style: normal;
    text-decoration: none;
  }
</style>
