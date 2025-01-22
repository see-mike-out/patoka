<script>
  import { writable } from "svelte/store";
  import Title from "./Title.svelte";
  import Panel from "./Panel.svelte";
  import { titles } from "./meta_info";
  import NudvMapPanel from "./NudvMapPanel.svelte";
  import GatesPanel from "./GatesPanel.svelte";
  import GenQubitPanel from "./GenQubitPanel.svelte";
  import QubitListPanel from "./QubitListPanel.svelte";
  import CircuitViewPanel from "./CircuitViewPanel.svelte";
  import MatrixPanel from "./MatrixPanel.svelte";
  import QubitFreqPanel from "./QubitFreqPanel.svelte";
  import { onMount } from "svelte";

  export let data = writable();
  export let addToBasket = () => {};
  export let openTimeMachine = () => {};
  export let basket;
  export let section_meta;
  export let is_prop_timed;
  export let property_time = writable();

  let hide = false;
  function toggleSection() {
    hide = !hide;
  }
  onMount(() => {
    if (
      section_meta?.key === "properties" &&
      section_meta?.title === "Overall"
    ) {
      hide = true;
    }
  });
</script>

{#if $data && section_meta}
  <section>
    <Title
      title={section_meta.title || titles[section_meta.key]}
      note={is_prop_timed && $property_time !== "current"
        ? "Collected at: " + $property_time
        : ""}
      {toggleSection}
      {hide}
      level={2}
    ></Title>
    {#if !hide}
      <div class="panel">
        {#each section_meta?.order as sub}
          {#if sub === "general"}
            <NudvMapPanel
              key={sub}
              value={(is_prop_timed && $property_time !== "current"
                ? $data.timed_properties[$property_time]
                : $data[section_meta.key])[sub]}
              parentKey={sub}
              topLevelKey={section_meta.key}
              level={2}
              {addToBasket}
              {basket}
              {openTimeMachine}
              code_header={`list(fliter(lambda x: x.name == "`}
              code_footer={`", backend.properties().general))[0]`}
            ></NudvMapPanel>
          {:else if sub === "gates"}
            <GatesPanel
              key={sub}
              value={(is_prop_timed && $property_time !== "current"
                ? $data.timed_properties[$property_time]
                : $data[section_meta.key])[sub]}
              parentKey={sub}
              topLevelKey={section_meta.key}
              level={2}
              {addToBasket}
              {basket}
              {openTimeMachine}
              code_header={`backend.properties().gate_property(`}
              code_footer={`)`}
            ></GatesPanel>
          {:else if sub === "general_qlists"}
            <GenQubitPanel
              key={sub}
              value={(is_prop_timed && $property_time !== "current"
                ? $data.timed_properties[$property_time]
                : $data[section_meta.key])?.[sub]}
              parentKey={sub}
              topLevelKey={section_meta.key}
              level={2}
              {addToBasket}
              {basket}
              {openTimeMachine}
              code_header="backend.properties().general_qlists["
              code_footer="]"
            ></GenQubitPanel>
          {:else if sub === "qubits"}
            <QubitListPanel
              key={sub}
              value={(is_prop_timed && $property_time !== "current"
                ? $data.timed_properties[$property_time]
                : $data[section_meta.key])[sub]}
              parentKey={sub}
              topLevelKey={section_meta.key}
              level={2}
              {addToBasket}
              {basket}
              {openTimeMachine}
              {property_time}
              code_header="backend.properties().qubit_property("
              code_footer=")"
            ></QubitListPanel>
          {:else if sub === "faulty_qubits"}
            <Panel
              key={sub}
              value={(is_prop_timed && $property_time !== "current"
                ? $data.timed_properties[$property_time]
                : $data[section_meta.key])[sub].join(", ")}
              parentKey={sub}
              topLevelKey={section_meta.key}
              level={2}
              {addToBasket}
              {basket}
            ></Panel>
          {:else if sub === "faulty_gates"}
            <GatesPanel
              key={sub}
              parentKey={sub}
              topLevelKey={section_meta.key}
              value={(is_prop_timed && $property_time !== "current"
                ? $data.timed_properties[$property_time]
                : $data[section_meta.key])[sub]}
              level={2}
              {addToBasket}
              {basket}
            ></GatesPanel>
          {:else if sub === "circuit_view"}
            <CircuitViewPanel
              key={sub}
              qubit_edges={$data[section_meta.key].edges}
              qubit_nodes={$data.circuit_nodes}
              qubit_index={$data[section_meta.key].nodes}
              qubit_info={$data.properties.qubits}
              gate_info={$data.properties.gates}
              level={2}
              {addToBasket}
              {basket}
            ></CircuitViewPanel>
          {:else if sub === "distance_matrix"}
            <MatrixPanel
              key={sub}
              value={$data[section_meta.key][sub]}
              level={2}
              {addToBasket}
              {basket}
            ></MatrixPanel>
          {:else if sub === "qubit_freq_est"}
            <QubitFreqPanel
              key={sub}
              value={$data[section_meta.key][sub]}
              level={2}
              code_header="backend.defaults().qubit_freq_est["
              code_footer="]"
              {addToBasket}
              {basket}
            ></QubitFreqPanel>
          {:else if sub === "meas_freq_est"}
            <QubitFreqPanel
              key={sub}
              value={$data[section_meta.key][sub]}
              level={2}
              code_header="backend.defaults().meas_freq_est["
              code_footer="]"
              {addToBasket}
              {basket}
            ></QubitFreqPanel>
          {:else}
            <Panel
              key={sub}
              value={$data[section_meta.key]?.[sub]}
              level={2}
              {addToBasket}
              {basket}
            ></Panel>
          {/if}
        {/each}
      </div>
    {/if}
  </section>
{/if}

<style>
  * {
    box-sizing: border-box;
    font-family: sans-serif;
    line-height: 100%;
  }
  section {
    width: 100%;
    padding: 1rem 0 0rem 0;
    /* border-top: 1px solid #ddd;
    margin-top: 1rem; */
  }
  .panel {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
    column-gap: 1rem;
    row-gap: 1rem;
  }
</style>
