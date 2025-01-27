<script>
  import { onMount } from "svelte";
  import { planMachineView } from "./svg_utils/plan_draw_machine";
  import SvgWrap from "./svgs/SVGWrap.svelte";
  import { writable } from "svelte/store";
  // import { browser } from "$app/environment";
  import MachineViewProgress from "./MachineViewProgress.svelte";
  import LayerTimeMarker from "./LayerTimeMarker.svelte";
  import { scaleSequential, interpolateRdYlGn } from "d3";
  import {
    addGradientDef,
    getGradient,
    removeGradientDef,
  } from "./svg_utils/util";
  import { timer } from "d3";
  import { get_qiskit_charge } from "./svg_utils/cost_conversion";
  export let data,
    id,
    original_circuit_id,
    transpiled_circuit_id,
    pulse_view_id,
    match,
    operation_data,
    machine_moment_at = writable(0),
    machine_dt_at = writable(0),
    op_schedule = writable([]),
    open_tool = () => {},
    filter_unused_qubits = false,
    autoplay = writable(false);

  let browser = window;
  let drawPlan = writable();
  let curr_layer = writable(null),
    anim_curr_layer = writable(0);
  let keep_timescale = writable(false),
    is_playing = false;
  let total_duration = 10;

  let nodeColorScale = scaleSequential(interpolateRdYlGn);

  curr_layer.subscribe((i) => {
    dehighlight_edge_gate();
    if (i >= 0 && i <= $drawPlan?.operations?.length - 1)
      highlight_edge_gate(i);
    change_node_esp(i);
  });

  anim_curr_layer.subscribe((i) => {
    dehighlight_edge_gate();
    if (i >= 0 && i <= $drawPlan?.operations?.length - 1)
      highlight_edge_gate(i);
    change_node_esp(i);
  });

  drawPlan.subscribe((d) => {
    if (d?.operations) {
      curr_layer.set(0);
      change_node_esp(0);
    }
  });

  $: {
    if (data) {
      drawPlan.set(
        planMachineView(data, operation_data, {
          id,
          original_circuit_id,
          transpiled_circuit_id,
          pulse_view_id,
          match,
          nodeColorScale,
          filter_unused_qubits,
        }),
      );
      total_duration = $drawPlan?.operations
        ?.map((e) => e.duration)
        .reduce((a, c) => a + c, 0);
      change_node_esp(0);
    }
  }

  let gradientDefs = [];

  onMount(() => {
    if (data) {
      drawPlan.set(
        planMachineView(data, operation_data, {
          id,
          original_circuit_id,
          transpiled_circuit_id,
          pulse_view_id,
          match,
          nodeColorScale,
          filter_unused_qubits,
        }),
      );
      total_duration = $drawPlan.operations
        ?.map((e) => e.duration)
        .reduce((a, c) => a + c, 0);
      change_node_esp(0);
    }
  });

  let time_factors = [
    1000 / 50,
    1000 / 100,
    1000 / 150,
    1000 / 200,
    1000 / 250,
    1000 / 300,
    1000 / 350,
    1000 / 400,
  ];
  let time_factor = writable(3);

  function slower_animation() {
    time_factor.update((f) => {
      return Math.max(f - 1, 0);
    });
  }

  function faster_animation() {
    time_factor.update((f) => {
      return Math.min(f + 1, time_factors.length - 1);
    });
  }

  function pause(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  async function animate() {
    is_playing = true;
    anim_curr_layer.set(0);
    let li = 0;
    if (!$drawPlan?.operations) return;
    for (const layer of $drawPlan?.operations) {
      if (!is_playing) {
        autoplay.set(false);
        curr_layer.set($anim_curr_layer);
        return;
      }
      // update
      let time =
        time_factors[$time_factor] *
        ($keep_timescale ? $op_schedule[$anim_curr_layer] : 100);
      if (time > 0) {
        let dur =
          ($op_schedule[$anim_curr_layer + 1] === undefined
            ? $op_schedule[$anim_curr_layer]
            : $op_schedule[$anim_curr_layer + 1]) -
          $op_schedule[$anim_curr_layer];
        let t = timer((elapsed) => {
          // dfaf
          machine_dt_at.set(
            $op_schedule[$anim_curr_layer] + (dur * elapsed) / time,
          );
          if (elapsed > time) t.stop();
        });
        await pause(time);
      }
      // todo: dehighlight (edges, gates)
      if (!is_playing) {
        autoplay.set(false);
        curr_layer.set($anim_curr_layer);
        return;
      }
      anim_curr_layer.update((i) =>
        Math.min(i + 1, $drawPlan.operations.length - 1),
      );
    }
    autoplay.set(false);
    curr_layer.set(0);
    return;
  }

  function highlight_edge_gate(i) {
    // (edges, gates)
    removeGradientDef(transpiled_circuit_id, gradientDefs);
    gradientDefs = [];
    let layer = $drawPlan?.operations?.[i];
    let match_color = [],
      original_layers = [];
    if (layer?.elem) {
      let op_groups = layer.elem.filter(
        (d) => d.role === "op-layer-operation-group",
      );
      if (op_groups) {
        op_groups.forEach((op_group) => {
          let edge_ids = op_group.data.edge_ids;
          edge_ids.forEach((ei) => {
            let el = document.querySelector(
              `#${id} #${ei}--group .highlight-wrap`,
            );
            if (el) {
              el.classList.add("edge-highlighted");
              el.style.fill = op_group.data.match_color;
              el.style.fillOpacity = `0.4`;
            }
          });
          let oid = op_group.data.operation_index;
          let top_elem = document.querySelector(
            `#${transpiled_circuit_id} .gate-wrap.layer-${i}.gate-${oid}.transpiled`,
          );
          if (top_elem) {
            top_elem.classList.add("op-highlighted");
            top_elem.style.outline = `2px solid ${op_group.data.match_color}`;
          }
          let olid = op_group.data.original_layer_index;
          original_layers.push(olid);
          let ooid = op_group.data.original_operation_index;
          let oop_elem = document.querySelector(
            `#${original_circuit_id} .gate-wrap.layer-${olid}.gate-${ooid}.original`,
          );
          if (oop_elem) {
            oop_elem.classList.add("op-highlighted");
            oop_elem.style.outline = `2px solid ${op_group.data.match_color}`;
          }
          match_color.push(op_group.data.match_color);
        });
      }
      let lwrap = document.querySelector(
        `#${transpiled_circuit_id} #layer-${i}--interaction-wrap`,
      );
      if (lwrap) {
        let grad_data = getGradient(match_color);
        let grad_value = grad_data ? `tg-l-${i}` : null;
        if (grad_value) {
          addGradientDef(transpiled_circuit_id, {
            id: grad_value,
            grad_data,
          });
          gradientDefs.push(grad_value);
        }
        lwrap.classList.add("layer-highlighted");
        lwrap.style.fill = grad_value
          ? `url(#${grad_value})`
          : match_color[0] || "#000000";
        lwrap.style.fillOpacity = `0.2`;
      }
      original_layers.forEach((olid, k) => {
        let olwrap = document.querySelector(
          `#${original_circuit_id} #layer-${olid}--interaction-wrap`,
        );
        if (olwrap) {
          olwrap.classList.add("layer-highlighted");
          olwrap.style.fill = match_color[k];
          olwrap.style.fillOpacity = `0.2`;
        }
      });
    }
  }
  function dehighlight_edge_gate() {
    // (edges, gates)
    let ehls = Array.from(
      browser
        ? document.querySelectorAll(
            `#${transpiled_circuit_id} .edge-highlighted`,
          )
        : [],
    );
    ehls?.forEach((el) => {
      el.classList.remove("edge-highlighted");
      el.style.fill = "#ffffff";
      el.style.fillOpacity = 0;
    });
    let lhls = Array.from(
      browser
        ? document.querySelectorAll(
            `#${transpiled_circuit_id} .layer-highlighted`,
          )
        : [],
    );
    lhls?.forEach((el) => {
      el.classList.remove("layer-highlighted");
      el.style.fillOpacity = 0;
    });
    let ohls = Array.from(
      browser
        ? document.querySelectorAll(`#${transpiled_circuit_id} .op-highlighted`)
        : [],
    );
    ohls?.forEach((el) => {
      el.classList.remove("op-highlighted");
      el.style.outline = null;
    });
    let o_lhls = Array.from(
      browser
        ? document.querySelectorAll(
            `#${original_circuit_id} .layer-highlighted`,
          )
        : [],
    );
    o_lhls?.forEach((el) => {
      el.classList.remove("layer-highlighted");
      el.style.fillOpacity = 0;
    });
    let o_ohls = Array.from(
      browser
        ? document.querySelectorAll(`#${original_circuit_id} .op-highlighted`)
        : [],
    );
    o_ohls?.forEach((el) => {
      el.classList.remove("op-highlighted");
      el.style.outline = null;
    });
  }
  function change_node_esp(li) {
    let point = $drawPlan?.operations[li].elem?.filter(
      (d) => d.role === "op-layer-operation-group",
    )?.[0];
    let rel_map = $drawPlan?.bit_map?.qubit_rel_map || {};

    if (point) {
      data?.design?.nodes?.forEach((node, ni) => {
        if (rel_map[node.index] !== undefined) {
          machine_moment_at.set(li);
          machine_dt_at.set($op_schedule[li]);
          let value =
            (point.data?.esp_qubit_wise?.[rel_map[node.index]] -
              operation_data.esp) /
            (1 - operation_data.esp);
          let el = document.querySelector(
            `#${id} #qubit-node-${node.index}--node`,
          );
          if (el) el.setAttribute("fill", nodeColorScale(value));
        }
      });
    }
  }

  function quit_animate() {
    is_playing = false;
  }

  autoplay.subscribe((a) => {
    if (a) {
      animate();
    } else {
      quit_animate();
    }
  });

  let cost_shots = 1000,
    cost_charge = 0,
    cost_time;
  $: {
    cost_charge = get_qiskit_charge(
      $drawPlan.meta_info.cummul_duration,
      cost_shots,
    );
    cost_time = cost_shots * $drawPlan.meta_info.cummul_duration;
  }
</script>

{#if data && $drawPlan}
  <h5>Cost estimate</h5>
  <div class="cost-explorer">
    <div class="input-wrap">
      <label for={"cost-exp-shots-" + id}>Shots</label>
      <input
        id={"cost-exp-shots-" + id}
        type="number"
        bind:value={cost_shots}
      />
    </div>
    <div class="input-wrap">
      <label for={"cost-exp-shots-" + id}>Time (ns)</label>
      <!-- svelte-ignore illegal-attribute-character -->
      <input
        id={"cost-exp-shots-" + id}
        type="number"
        disabled
        value={cost_time}
      />
    </div>
    <div class="input-wrap">
      <label for={"cost-exp-shots-" + id}>Estimated costs $</label>
      <!-- svelte-ignore illegal-attribute-character -->
      <input
        id={"cost-exp-shots-" + id}
        type="number"
        disabled
        value={cost_charge}
      />
    </div>
  </div>
  <p class="note">
    The estimated cost is only for the operations. The actual cost includes
    qubit initialization, etc.
  </p>
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
    {#if $drawPlan.groups.machine}
      <SvgWrap data={$drawPlan.groups.machine} {open_tool}></SvgWrap>
    {/if}
    {#if $drawPlan.operations && !$autoplay}
      <SvgWrap data={$drawPlan.operations[$curr_layer]} {open_tool}></SvgWrap>
    {:else if $drawPlan.operations && $autoplay}
      <SvgWrap data={$drawPlan.operations[$anim_curr_layer]} {open_tool}
      ></SvgWrap>
    {/if}
  </svg>

  {#if $drawPlan.operations}
    {#if $keep_timescale && $autoplay}
      <div class="button-wrap">
        <LayerTimeMarker
          duration={$drawPlan.operations?.[
            $autoplay ? $anim_curr_layer : $curr_layer
          ]?.duration}
        ></LayerTimeMarker>
      </div>
    {/if}
    <div class="button-wrap">
      <MachineViewProgress
        total={$drawPlan.operations.length}
        curr={$autoplay ? $anim_curr_layer : $curr_layer}
      ></MachineViewProgress>
    </div>
    <div class="button-wrap">
      <button
        disabled={$curr_layer == 0 || $autoplay}
        on:click={() => {
          curr_layer.update((i) => {
            return 0;
          });
        }}>To first</button
      >
      <button
        disabled={$curr_layer == 0 || $autoplay}
        on:click={() => {
          curr_layer.update((i) => {
            return i - 1;
          });
        }}>&leftarrow; Prev</button
      >
      <button
        on:click={() => {
          curr_layer.update((i) => {
            return i + 1;
          });
        }}
        disabled={$curr_layer == $drawPlan.operations.length - 1 || $autoplay}
        >Next &rightarrow;</button
      >
      <button
        disabled={$curr_layer == $drawPlan.operations.length - 1 || $autoplay}
        on:click={() => {
          curr_layer.update((i) => {
            return $drawPlan.operations.length - 1;
          });
        }}>To last</button
      >
    </div>
    <div class="button-wrap">
      <button
        on:click={() => {
          autoplay.set(true);
        }}
        disabled={$autoplay}>Autoplay</button
      >
      <button
        on:click={() => {
          autoplay.set(false);
        }}
        disabled={!$autoplay}>Stop</button
      >
      <button
        on:click={() => {
          slower_animation();
        }}
        disabled={$time_factor == 0}>Slower</button
      >
      <button
        on:click={() => {
          faster_animation();
        }}
        disabled={$time_factor == time_factors.length - 1}>Faster</button
      >
      <br />
      <div style="margin-top: 0.25rem;">
        <input
          type="checkbox"
          name="match-time-scale"
          on:change={(e) => {
            keep_timescale.set(e.target.checked);
          }}
        />
        <label for="match-time-scale">Keep times</label>
        <span class="speed">
          Speed: {5 / time_factors[$time_factor]}x
        </span>
      </div>
    </div>
  {/if}
{/if}

<style>
  .button-wrap {
    margin: 0.5rem 0;
  }
  .button-wrap button {
    font-family: iosevka;
    padding: 0.25rem 0.5rem;
    font-size: 0.75rem;
    appearance: none;
    line-height: 100%;
    border: 1px solid #aaa;
    background-color: white;
    border-radius: 0.25rem;
  }
  input[type="checkbox"] {
    margin: 0;
    line-height: 100%;
    vertical-align: middle;
  }
  label {
    font-family: iosevka;
    font-size: 0.75rem;
  }
  .speed {
    font-family: iosevka;
    font-size: 0.75rem;
    padding-left: 0.5rem;
  }
  .button-wrap button:hover {
    background-color: #f0f0f0;
  }

  .cost-explorer {
    display: flex;
    column-gap: 1rem;
    row-gap: 0.5rem;
    flex-wrap: wrap;
  }
  .input-wrap {
    margin: 0;
    padding: 0;
  }
  .input-wrap input[type="number"] {
    font-family: iosevka;
    padding: 0.25rem 0.5rem;
    font-size: 0.75rem;
    appearance: none;
    line-height: 100%;
    border: 1px solid #aaa;
    background-color: white;
    border-radius: 0.25rem;
    width: 90px;
  }
  .input-wrap input:disabled {
    background-color: #f0f0f0;
  }

  h5 {
    margin: 0 0 0.25rem 0;
    padding: 0;
    font-family: iosevka;
  }

  p.note {
    display: block;
    font-size: 0.8rem;
    color: #999;
    margin: 0.5rem 0;
  }
</style>
