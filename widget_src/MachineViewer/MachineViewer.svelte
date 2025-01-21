<script>
  import { onDestroy, onMount } from "svelte";
  import { writable } from "svelte/store";
  import { sections } from "./meta_info";
  import { makeCode } from "./util";
  import Section from "./Section.svelte";
  import TimeMachine from "./TimeMachine.svelte";
  import CodeConfigure from "./CodeConfigure.svelte";
  import { copyToClipboardHelper } from "../CircuitViewer/copy_helper";
  export let model;
  export let data_key = "machine_data",
    output_key = "code";
  let str_data = model.get(data_key);
  let parsed_data = JSON.parse(str_data);
  let event = `change:${data_key}`;
  let callback = () => (circ = model.get(data_key));
  let data = writable();
  let basket = writable([]);
  let basket_code = writable("");
  let code_config = writable({
    backend_var_name: "backend",
    as_function: true,
  });
  let property_time = writable("current");

  onMount(() => {
    data.set(parsed_data);
    model.on(event, callback);
    basket.subscribe((d) => {
      basket_code.set(makeCode(d, $code_config));
    });
    code_config.subscribe((c) => {
      basket_code.set(makeCode($basket, c));
    });
    basket_code.subscribe((code) => {
      model.set(output_key, code);
      model.save_changes();
    });
console.log($data)
  });

  onDestroy(() => {
    model.off(event, callback);
  });

  function addToBasket(a) {
    basket.update((d) => {
      if (d.includes(a)) {
        d.splice(d.indexOf(a), 1);
      } else {
        d.push(a);
      }
      return d;
    });
  }

  let showTimeMachine = false;
  let timeMachineData = writable();
  function openTimeMachine(dt) {
    let timed_props = $data.timed_properties;
    let timed_props_data = [];
    if (dt.datatype === "nudv-map") {
      for (const date of Object.keys(timed_props)) {
        let item = {
          date,
        };
        if (dt.subtype === "qubit-property") {
          item.data =
            timed_props[date][dt.parentKey][dt.qubit_index][dt.property];
        } else {
          item.data = timed_props[date][dt.parentKey][dt.key];
        }

        timed_props_data.push(item);
      }
    } else if (dt.datatype === "gates") {
      for (const date of Object.keys(timed_props)) {
        let v = timed_props[date][dt.parentKey].filter(
          (d) =>
            d.gate === dt.data.gate &&
            d.qubits.join("-") === dt.data.qubits.join("-"),
        )[0];

        timed_props_data.push({
          date,
          data: v,
        });
      }
    }
    showTimeMachine = true;

    timeMachineData.set({
      datatype: dt.datatype,
      key: dt.key,
      title_key: dt.title_key,
      parentKey: dt.parentKey,
      topLevelKey: dt.topLevelKey,
      code_header: dt.code_header,
      code_footer: dt.code_footer,
      code_key: dt.code_key,
      curr_data: dt.data,
      history_data: timed_props_data,
    });
  }
  function closeTimeMachine() {
    showTimeMachine = false;
  }
</script>

<section class="wrap" id="machine-viewer-wrap">
  <h3>
    Machine information
    <button
      on:click={(e) => {
        copyToClipboardHelper($basket_code);
      }}>Copy reusable code</button
    >
  </h3>
  <CodeConfigure {code_config}></CodeConfigure>
  {#if $data}
    <Section
      {data}
      {addToBasket}
      {basket}
      section_meta={sections[0]}
      {openTimeMachine}
    ></Section>
    <Section
      {data}
      {addToBasket}
      {basket}
      section_meta={sections[1]}
      {openTimeMachine}
    ></Section>
    <Section
      {data}
      {addToBasket}
      {basket}
      {openTimeMachine}
      section_meta={sections[2]}
      hide={true}
    ></Section>
    <Section
      {data}
      {addToBasket}
      {basket}
      {openTimeMachine}
      {property_time}
      section_meta={sections[3]}
    ></Section>
    <Section
      {data}
      {addToBasket}
      {basket}
      {openTimeMachine}
      section_meta={sections[4]}
      hide={true}
    ></Section>
    <Section
      {data}
      {addToBasket}
      {basket}
      {openTimeMachine}
      section_meta={sections[5]}
      hide={true}
    ></Section>
    <Section
      {data}
      {addToBasket}
      {basket}
      {openTimeMachine}
      section_meta={sections[6]}
      hide={true}
    ></Section>
    <Section
      {data}
      {addToBasket}
      {basket}
      {openTimeMachine}
      section_meta={sections[7]}
      hide={true}
    ></Section>
    <Section
      {data}
      {addToBasket}
      {basket}
      {openTimeMachine}
      section_meta={sections[8]}
    ></Section>
  {/if}
</section>

{#if showTimeMachine}
  <TimeMachine {timeMachineData} {closeTimeMachine} {addToBasket} {basket}
  ></TimeMachine>
{/if}

<!-- <pre>{$basket_code}</pre> -->

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
    margin: 0 0 0.5rem 0;
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
  pre {
    font-family: var(--font-mono);
  }
  :global(article .content-wrap *) {
    font-family: var(--font-mono) !important;
  }
</style>
