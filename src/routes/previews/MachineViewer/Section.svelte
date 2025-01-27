<script>
  import { writable } from "svelte/store";
  import Title from "./Title.svelte";
  import Panel from "./Panel.svelte";
  import Subsection from "./Subsection.svelte";
  import OpTablePanel from "./OpTablePanel.svelte";
  import InstructionsPanel from "./InstructionsPanel.svelte";
  import { onMount } from "svelte";

  export let data = writable();
  export let addToBasket = () => {};
  export let openTimeMachine = () => {};
  export let property_time = writable();
  export let basket;
  export let section_meta;
  export let hide = false;
  function toggleSection() {
    hide = !hide;
  }
  let is_prop_timed = false;
  onMount(() => {
    is_prop_timed = $data.property_times && section_meta.title === "Properties";
  });
</script>

{#if $data && section_meta}
  <section>
    <Title title={section_meta.title} {toggleSection} {hide} level={1}></Title>
    {#if !hide}
      {#if is_prop_timed}
        <div class="input-row sticky">
          <div class="input-wrap">
            <label for="property-time-machine"> Collected at: </label>
            <select
              id="property-time-machine"
              on:change={(e) => {
                property_time.set(e.target.value);
              }}
            >
              <option value="current" selected={$property_time === "current"}
                >Current</option
              >
              {#each Object.keys($data.timed_properties) as time, ti}
                <option value={time} selected={$property_time === time}
                  >{time}</option
                >
              {/each}
            </select>
          </div>
        </div>
      {/if}
      <div class="panel">
        {#each section_meta?.subsections as sub}
          <!-- special cases -->
          {#if sub === "asof"}
            <Panel key={sub} value={$data[sub]} level={1}></Panel>
          {:else if sub === "operations"}
            <OpTablePanel
              key={sub}
              value={$data[sub]}
              level={1}
              {addToBasket}
              {basket}
              {openTimeMachine}
              code_header={`list(fliter(lambda x: x.name == "`}
              code_footer={`", backend.operations))[0]`}
            ></OpTablePanel>
          {:else if sub === "instructions"}
            <InstructionsPanel
              key={sub}
              value={$data[sub]}
              level={1}
              {addToBasket}
              {basket}
              {openTimeMachine}
              code_header={`list(fliter(lambda x: `}
              code_footer={`, backend.operations))[0]`}
            ></InstructionsPanel>
          {:else if !sub.key}
            <Panel
              key={sub}
              value={$data[sub]}
              level={1}
              {addToBasket}
              {basket}
              {openTimeMachine}
            ></Panel>
          {/if}
        {/each}
      </div>
      {#each section_meta?.subsections as sub}
        {#if sub.key && sub.order}
          <Subsection
            section_meta={sub}
            {addToBasket}
            {basket}
            {data}
            {openTimeMachine}
            {is_prop_timed}
            {property_time}
          ></Subsection>
        {/if}
      {/each}
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
    padding: 1rem;
    border-bottom: 1px solid #ddd;
  }
  .panel {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
    column-gap: 1rem;
    row-gap: 1rem;
  }
  .sticky {
    position: sticky;
    top: 38px;
    z-index: 3100;
    background-color: white;
  }
  .input-row {
    display: flex;
    margin-top: 0.5rem;
    column-gap: 1.5rem;
  }
  .input-wrap {
    display: flex;
    column-gap: 0.5rem;
  }
  .input-wrap label {
    display: block;
    font-size: 0.9rem;
    padding: 0.5rem 0;
    border: 1px solid transparent;
  }
  .input-wrap select {
    display: block;
    font-family: var(--font-mono);
    border: 1px solid #ddd;
    border-radius: 0.25rem;
    padding: 0.25rem 0.5rem;
    font-size: 0.9rem;
    line-height: 100%;
  }
</style>
