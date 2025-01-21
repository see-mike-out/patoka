<script>
  import { onDestroy, onMount } from "svelte";
  import { writable } from "svelte/store";
  import Circuit from "./Circuit.svelte";
  import Information from "./Information.svelte";
  import MachineView from "./MachineView.svelte";
  import { getSVGimageLink } from "./svg_utils/util";
  import { copyToClipboardHelper } from "./copy_helper";
  import TranspileDataView from "./TranspileDataView.svelte";
  import TranspileSummary from "./TranspileSummary.svelte";
  import PulseView from "./PulseView.svelte";
  export let model;
  export let key_circ = "circ";
  let circ = model.get(key_circ);
  let parsed_circ = JSON.parse(circ);
  let event = `change:${key_circ}`;
  let callback = () => (circ = model.get(key_circ));
  let data = writable();
  let machine_moment_at = [writable(0)];
  let operation_schedules = [writable([])];
  let machine_dt_at = [writable(0)];
  let transpile_at = writable(0);
  let autoplays = [writable(false)];

  let show_transpile_summary = true;
  let filter_unused_qubits = [];

  let selected_info = writable();
  let images = {};
  let images_loader = writable();
  images_loader.subscribe((d) => {
    if (d) {
      images[d.id] = d;
    }
  });

  function open_tool(info) {
    selected_info.set(info);
  }

  let unit_id = "";

  onMount(() => {
    unit_id = crypto.randomUUID();
    data.set(parsed_circ);
    model.on(event, callback);
    machine_moment_at = $data?.transpiled?.map(() => writable(0));
    machine_dt_at = $data?.transpiled?.map(() => writable(0));
    operation_schedules = $data?.transpiled?.map(() => writable([]));
    filter_unused_qubits = $data?.transpiled?.map(() => true);
    autoplays = $data?.transpiled?.map(() => writable(false));
    console.log($data);
  });

  onDestroy(() => {
    model.off(event, callback);
  });
</script>

<div class="frame" id={"circuit-viewer-" + unit_id}>
  <div class="original-circuit-column">
    <section class="circuit-view-wrap original">
      <h1>
        Original Circuit <button
          class="save-make"
          on:click={(e) => {
            getSVGimageLink("original-circuit", images_loader);
          }}>Image</button
        >
        {#if images["original-circuit"]}
          <a
            class="save-download"
            href={images["original-circuit"].png}
            download>PNG</a
          >
          <a
            class="save-download"
            href={images["original-circuit"].svg}
            download>SVG</a
          >
        {/if}
        {#if $data?.original?.qasm2}
          <span class="save-make-label">QASM2: </span>
          <button
            class="save-make"
            on:click={(e) => {
              copyToClipboardHelper($data?.original?.qasm2);
            }}>Copy</button
          >
          <button
            class="save-make"
            on:click={(e) => {
              open_tool({
                data: {
                  qasm_version: 2,
                  title: "Original Circuit",
                  qasm: $data?.original?.qasm2,
                },
              });
            }}>Show</button
          >
        {/if}
        {#if $data?.original?.qasm3}
          <span class="save-make-label">QASM3: </span>
          <button
            class="save-make"
            on:click={(e) => {
              copyToClipboardHelper($data?.original?.qasm3);
            }}>Copy</button
          >
          <button
            class="save-make"
            on:click={(e) => {
              open_tool({
                data: {
                  qasm_version: 3,
                  title: "Original Circuit",
                  qasm: $data?.original?.qasm3,
                },
              });
            }}>Show</button
          >
        {/if}
      </h1>
      <div class="circuit">
        <Circuit
          id="original-circuit"
          circuit_data={$data?.original}
          is_original={true}
          match={$data?.transpiled[$transpile_at]?.match}
          matched_circuit_id={$data?.transpiled.map(
            (_, ti) => "transpiled-circuit-" + ti,
          )}
          matched_machine_id={$data?.transpiled.map(
            (_, ti) => "on-machine-" + ti,
          )}
          {open_tool}
          filter_unused_qubits={false}
          {unit_id}
        ></Circuit>
      </div>
    </section>
    <section class="circuit-view-wrap transpile-summary">
      <h1>
        Transpilation Summary <button
          class="save-make"
          on:click={() => {
            show_transpile_summary = !show_transpile_summary;
          }}>{show_transpile_summary ? "Hide" : "Show"}</button
        >
      </h1>
      {#if show_transpile_summary}
        <div class="info-section-wrap">
          <TranspileSummary transpile_data={$data?.transpiled}
          ></TranspileSummary>
        </div>
      {/if}
    </section>

    <section class="circuit-view-wrap info-section-group">
      <h1>Information & Interaction</h1>
      <div class="info-section-wrap">
        {#if $selected_info}
          <Information
            info={$selected_info.data}
            machine_moment_at={machine_moment_at[$transpile_at]}
          ></Information>
        {/if}
      </div>
    </section>
  </div>
  <div class="transpiled-circuit-column">
    {#each $data?.transpiled || [] as trans_circuit, ti}
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <div
        class="transpiled-wrap"
        on:focus={(e) => {
          transpile_at.set(ti);
        }}
        on:click={(e) => {
          transpile_at.set(ti);
        }}
      >
        <section class="circuit-view-wrap circuit-section">
          <h1>
            Transpiled Circuit {ti + 1}
            <button
              class="save-make"
              on:click={(e) => {
                filter_unused_qubits[ti] = !filter_unused_qubits[ti];
              }}
              >{filter_unused_qubits[ti] ? "Show" : "Filter"} unused qubits</button
            >
            <button
              class="save-make"
              on:click={(e) => {
                getSVGimageLink("transpiled-circuit-" + ti, images_loader);
              }}>Image</button
            >

            {#if images["transpiled-circuit-" + ti]}
              <a
                class="save-download"
                href={images["transpiled-circuit-" + ti].png}
                download>PNG</a
              >
              <a
                class="save-download"
                href={images["transpiled-circuit-" + ti].svg}
                download>SVG</a
              >
            {/if}

            {#if trans_circuit?.qasm2}
              <span class="save-make-label">QASM2: </span>
              <button
                class="save-make"
                on:click={(e) => {
                  copyToClipboardHelper(trans_circuit?.qasm2);
                }}>Copy</button
              >
              <button
                class="save-make"
                on:click={(e) => {
                  open_tool({
                    data: {
                      qasm_version: 2,
                      title: "Transpiled Circuit " + (ti + 1),
                      qasm: trans_circuit?.qasm2,
                    },
                  });
                }}>Show</button
              >
            {/if}
            {#if trans_circuit?.qasm3}
              <span class="save-make-label">QASM3: </span>
              <button
                class="save-make"
                on:click={(e) => {
                  copyToClipboardHelper(trans_circuit?.qasm3);
                }}>Copy</button
              >
              <button
                class="save-make"
                on:click={(e) => {
                  open_tool({
                    data: {
                      qasm_version: 3,
                      title: "Transpiled Circuit " + (ti + 1),
                      qasm: trans_circuit?.qasm3,
                    },
                  });
                }}>Show</button
              >
            {/if}
          </h1>
          <TranspileDataView
            backend={trans_circuit?.backend}
            params={trans_circuit?.transpile_param}
          ></TranspileDataView>
          <div class="circuit">
            <Circuit
              id={"transpiled-circuit-" + ti}
              circuit_data={trans_circuit}
              is_original={false}
              match={trans_circuit?.match}
              matched_circuit_id={["original-circuit"]}
              matched_machine_id={["on-machine-" + ti]}
              {open_tool}
              machine_moment_at={machine_moment_at[ti]}
              filter_unused_qubits={filter_unused_qubits[ti]}
              {unit_id}
            ></Circuit>
          </div>
        </section>

        <section class="circuit-view-wrap machine-section">
          <h1>
            On-machine view <button
              class="save-make"
              on:click={(e) => {
                getSVGimageLink("on-machine-" + ti, images_loader);
              }}>Image</button
            >
            {#if images["on-machine-" + ti]}
              <a
                class="save-download"
                href={images["on-machine-" + ti].png}
                download>PNG</a
              >
              <a
                class="save-download"
                href={images["on-machine-" + ti].svg}
                download>SVG</a
              >
            {/if}
          </h1>
          <div class="circuit">
            <MachineView
              data={trans_circuit?.backend}
              match={trans_circuit?.match}
              id={"on-machine-" + ti}
              transpiled_circuit_id={"transpiled-circuit-" + ti}
              original_circuit_id="original-circuit"
              pulse_view_id={"pulse-view-" + ti}
              operation_data={trans_circuit}
              {open_tool}
              machine_moment_at={machine_moment_at[ti]}
              filter_unused_qubits={filter_unused_qubits[ti]}
              machine_dt_at={machine_dt_at[ti]}
              op_schedule={operation_schedules[ti]}
              autoplay={autoplays[ti]}
              {unit_id}
            ></MachineView>
          </div>
          <div class="circuit">
            <PulseView
              id={"pulse-view-" + ti}
              transpiled_circuit_id={"transpiled-circuit-" + ti}
              original_circuit_id="original-circuit"
              circuit_layers={trans_circuit.layers}
              pulse_data={trans_circuit.pulse_data}
              gate_data={trans_circuit.backend.gate_info}
              {open_tool}
              machine_moment_at={machine_moment_at[ti]}
              machine_dt_at={machine_dt_at[ti]}
              op_schedule={operation_schedules[ti]}
              autoplay={autoplays[ti]}
            ></PulseView>
          </div>
        </section>
      </div>
    {/each}

    <span class="note">
      To support how each qubit contributes to the overall success, each qubit
      node shows its own ESP (estimated success probability) as the product of
      ESP values of the operations that have been applied to the qubit so far
      (i.e., up to the current moment). Thus, the term may be different then the
      overall ESP value which is the product of the ESP values of all the
      operations in the circut. The overall ESP value change is shown in the
      transpiled circuit view.
    </span>
  </div>
</div>

<!-- <span>
  <pre>
{JSON.stringify($data, null, 2)}
</pre>
</span> -->

<style>
  * {
    box-sizing: border-box;
    font-family: sans-serif;
    line-height: 100%;
  }
  .frame {
    display: flex;
    column-gap: 0.25rem;
  }
  .original-circuit-column {
    width: 30%;
    max-height: 800px;
    overflow-y: scroll;
  }
  .info-section-group {
    width: 100%;
  }
  .info-section-wrap {
    min-height: 1rem;
  }
  .transpiled-circuit-column {
    width: 70%;
    max-height: 800px;
    overflow-y: scroll;
  }

  .transpiled-wrap {
    display: flex;
    column-gap: 0;
  }

  .transpiled-wrap .circuit-section {
    width: 60%;
  }
  .transpiled-wrap .machine-section {
    width: 40%;
    border-left: 0 !important;
  }

  .circuit-view-wrap {
    padding: 0;
    border: 1px solid #ddd;
    margin-bottom: 0.25rem;
  }

  .circuit-view-wrap.original {
    max-height: 800px;
    position: sticky;
    top: 0;
    z-index: 7000;
    background-color: white;
  }

  .circuit {
    padding: 0.25rem 0.5rem;
    overflow-x: scroll;
  }

  h1 {
    font-size: 0.9rem;
    padding: 0.25rem 0.5rem;
    margin: 0;
    background-color: #f0f0f0;
    border-bottom: 1px solid #ddd;
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
  .save-make-label {
    display: inline-block;
    font-size: 0.8rem;
    text-decoration: none;
    margin-left: 0.5rem;
    margin-right: -0.25rem;
    color: #000000;
    border: 0;
    padding: 0;
    background-color: transparent;
    font-weight: 400;
  }

  .note {
    font-size: 0.8rem;
    color: #999;
  }
</style>
