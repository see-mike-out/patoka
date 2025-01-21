<script>
  import { onDestroy, onMount } from "svelte";
  import { writable } from "svelte/store";
  import GenericInfoPanel from "./panels/GenericInfoPanel.svelte";
  import CountHistogram from "./panels/CountHistogram.svelte";
  import CircuitPanel from "./panels/CircuitPanel.svelte";
  import BackendPanel from "./panels/BackendPanel.svelte";
  import ProblemSpecificPanel from "./panels/ProblemSpecificPanel.svelte";
  import QubitPanel from "./panels/QubitPanel.svelte";
  import GatePanel from "./panels/GatePanel.svelte";
  import FaultyPanel from "./panels/FaultyPanel.svelte";
  import MachinePanel from "./panels/MachinePanel.svelte";

  export let model;
  export let key_data = "data",
    key_update = "data_update";
  let _data = JSON.parse(model.get(key_data));

  let event = `change:${key_update}`;
  let callback = () => {
    let updates = JSON.parse(model.get(key_update));
    console.log(updates);
    data.update((d) => {
      if (updates.set) {
        Object.keys(updates.set).forEach((key) => {
          d[key] = updates.set[key];
        });
      }
      if (updates.append) {
        Object.keys(updates.append).forEach((key) => {
          if (!d[key]) {
            if (updates.append[key].constructor.name === "Array") {
              d[key] = [];
            } else if (updates.append[key].constructor.name === "String") {
              d[key] = "";
            } else if (updates.append[key].constructor.name === "Object") {
              d[key] = {};
            }
          }

          if (d[key].constructor.name === "Array") {
            d[key].push(...updates.append[key]);
          } else if (d[key].constructor.name === "String") {
            d[key] = d[key] + updates.append[key];
          } else if (d[key].constructor.name === "Object") {
            for (let subkey in updates.append[key]) {
              d[key][subkey] = updates.append[key][subkey];
            }
          }
        });
      }
      return d;
    });
    console.log($data);
  };

  let data = writable();

  onMount(() => {
    data.subscribe((d) => {
      if (d && !d.physical_qubits) {
        d.physical_qubits = [];
        if (d.bit_match) {
          d.physical_qubits = d.bit_match
            .filter((e) => !e.is_ancilla)
            .map((e) => e.to);
        }
      }

      if (d?.backend_properties?.qubits) {
        d.backend_properties.qubits.forEach((e, i) => {
          e.index = { value: i };
        });
      }
    });
    data.set(_data);
    // data.set({});

    console.log($data);
    model.on(event, callback);
  });

  onDestroy(() => {
    model.off(event, callback);
  });
</script>

{#if $data}
  <div class="wrap">
    <h3>Quantum Job Viewer</h3>
    <div class="panel-wrapper">
      <!-- generic information -->
      <GenericInfoPanel {data}></GenericInfoPanel>
      <!-- counts -->
      <CountHistogram {data}></CountHistogram>
      <!-- problem specific visualization -->
      <ProblemSpecificPanel {data}></ProblemSpecificPanel>
      <!-- Original circuit -->
      <CircuitPanel
        panel_name="Original circuit"
        id="original-circuit"
        circuit_data={{
          layers: $data.original_circuit_layout,
          qubits: [],
          qubits: [],
          global_phase: $data.original_circuit_global_phase,
          layer_index: $data.original_circuit_layout_index,
        }}
        bit_match={$data.bit_match}
        pagination={{
          page: $data.original_circuit_page,
          range: $data.original_circuit_page_range,
          total_page: $data.original_circuit_total_page,
        }}
      ></CircuitPanel>
      <!-- Transpiled circuit -->
      <CircuitPanel
        panel_name="Transpiled circuit"
        id="transpiled-circuit"
        circuit_data={{
          layers: $data.transpiled_circuit_layout,
          qubits: [],
          global_phase: $data.transpiled_circuit_global_phase,
          layer_index: $data.transpiled_circuit_layout_index
        }}
        bit_match={$data.bit_match}
        pagination={{
          page: $data.transpiled_circuit_page,
          range: $data.transpiled_circuit_page_range,
          total_page: $data.transpiled_circuit_total_page,
        }}
      ></CircuitPanel>
      <!-- backend -->
      <MachinePanel {data}></MachinePanel>
      <BackendPanel {data}></BackendPanel>
      <QubitPanel {data}></QubitPanel>
      <GatePanel {data}></GatePanel>
      <FaultyPanel {data}></FaultyPanel>
    </div>
  </div>
{/if}

<style>
  :root {
    --font-body: "Source Sans Pro", -apple-system, BlinkMacSystemFont,
      "Segoe UI", Roboto, Oxygen, Ubuntu, Arial, Cantarell, "Open Sans",
      "Helvetica Neue", sans-serif;
    --font-mono: Iosevka, "Fira Mono", monospace;
  }
  h3 {
    position: sticky;
    top: 0;
    font-size: 1rem;
    padding: 0.5rem 1rem;
    margin: 0 0;
    background-color: #f0f0f0;
    border-bottom: 1px solid #ddd;
    border-radius: 0.5rem 0.5rem 0 0;
    z-index: 5000;
  }
  h3 button {
    appearance: none;
    padding: 0.25rem 0.5rem;
    margin-left: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 0.25rem;
    background-color: white;
    font-family: var(--font-mono);
    line-height: 100%;
    cursor: pointer;
  }
  .wrap {
    border: 1px solid #ddd;
    border-radius: 0.5rem;
    max-height: 70vh;
    overflow-y: scroll;
  }
  .panel-wrapper {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
    column-gap: 1rem;
    row-gap: 1rem;
    padding: 1rem;
    margin: 0;
  }

  :global(.panel-wrapper .panel) {
    border: 1px solid #ddd;
    border-radius: 0.25rem;
    box-shadow: 2px 2px 3px rgba(0, 0, 0, 0.05);
  }
  :global(.panel-wrapper .panel h4) {
    padding: 0.5rem;
    margin: 0;
    font-size: 0.9rem;
    border-bottom: 1px solid #ddd;
    background-color: #fafafa;
    border-radius: 0.25rem 0.25rem 0 0;
  }
  :global(.panel-wrapper .panel h4 button) {
    appearance: none;
    padding: 0.25rem;
    margin: 0 0 0 0.5rem;
    font-size: 0.8rem;
    border: 1px solid #ddd;
    border-radius: 0.15rem;
    cursor: pointer;
  }
  :global(.panel-wrapper .panel .content-wrap) {
    font-family: var(--font-mono) !important;
    padding: 0.25rem 0.5rem;
  }
  :global(.panel-wrapper .panel .content-wrap *) {
    font-family: var(--font-mono) !important;
  }
</style>
