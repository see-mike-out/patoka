<script>
  import { onDestroy, onMount } from "svelte";
  import Gate from "./Gate.svelte";
  import { deepcopy, gate_widths } from "./Gates/util";
  import { writable } from "svelte/store";
  export let moment = writable([]);
  export let circuit = {};
  export let open_tool = () => {};
  let width,
    subgate_widths = [];
  let submoments = [];
  function getWidth() {
    subgate_widths = [];
    submoments = [];
    return Math.max(
      ...$moment.map((d) => {
        if (!d.show_extended) {
          return gate_widths[d.gate_class || d.gate];
        } else {
          for (let substep of circuit.custom_gates[d.gate].subgates) {
            if (!submoments[substep.moment - 1])
              submoments[substep.moment - 1] = [];
            submoments[substep.moment - 1].push(substep);
          }
          return submoments
            .map((sm) => sm.map((s) => gate_widths[s.gate] || 16))
            .reduce((a, c, k) => {
              for (let i = 0; i < c.length; i++) {
                subgate_widths.push(a + (k > 0 ? 8 : 0));
              }
              return a + Math.max(...c);
            }, 0);
        }
      }),
    );
  }
  onMount(() => {
    width = getWidth();
    moment.subscribe(() => {
      width = getWidth();
    });
    if (!width) width = 16;
  });
</script>

{#if circuit}
  <div class="moment-wrap" style={`width: calc(${width}px + 1rem);`}>
    <div class="gates" style={`width: ${width}px;`}>
      {#each $moment as step, si}
        {#if !$moment[si].show_extended}
          <Gate
            step={$moment[si]}
            original_step={$moment[si]}
            step_index={si}
            original_step_index={si}
            is_substep={false}
            n_qubits={circuit.n_qubits}
            {circuit}
            {moment}
            {open_tool}
          ></Gate>
        {:else}
          {#each circuit.custom_gates[$moment[si].gate].subgates as substep, ssi}
            <div style={`position: absolute; left: ${subgate_widths[ssi]}px;`}>
              <Gate
                step={substep}
                original_step={$moment[si]}
                step_index={ssi}
                original_step_index={si}
                is_substep={true}
                n_qubits={circuit.n_qubits}
                {circuit}
                {moment}
                {open_tool}
              ></Gate>
            </div>
          {/each}
        {/if}
      {/each}
    </div>

    <div class="circuit-grid">
      {#each circuit.qubits as qubit, qi}
        <div class="row circuit-row">
          <div class="circuit-bar"></div>
        </div>
      {/each}
      {#if circuit.n_bits}
        <div class="row circuit-row-classical">
          <div class="circuit-bar"></div>
        </div>
      {/if}
    </div>
  </div>
{/if}

<style>
  * {
    box-sizing: border-box;
    line-height: 100%;
  }
  .moment-wrap {
    min-width: 1rem;
    position: relative;
  }
  .gates {
    position: absolute;
    top: 0;
    left: 0;
    padding: 0 0.5rem;
    background-color: rgba(0, 0, 0, 0.1);
    z-index: 1;
  }
  .circuit-grid {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    display: flex;
    flex-direction: column;
    z-index: 0;
  }
  .row {
    height: 2rem;
  }
  .circuit-row,
  .circuit-row-classical {
    position: relative;
  }
  .circuit-bar {
    width: 100%;
    position: absolute;
    left: 0;
    top: 50%;
  }
  .circuit-row .circuit-bar {
    border-top: 1px solid black;
    width: 100%;
    height: 1px;
    transform: translateY(-0.5px);
  }
  .circuit-row-classical .circuit-bar {
    border-top: 1px solid black;
    border-bottom: 1px solid black;
    width: 100%;
    height: 4px;
    transform: translateY(-2px);
  }
</style>
