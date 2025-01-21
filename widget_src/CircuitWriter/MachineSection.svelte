<script>
  import { writable } from "svelte/store";
  import { QiskitMachinesTypes, QiskitMachines } from "./machines";

  export let data = writable({});
</script>

<article>
  <h4>1. What machine do you want? How many bits do you need?</h4>
  <div class="input-row">
    <div class="input-form">
      <label for="machine">Machine</label>
      <select
        id="machine"
        name="machine"
        value={$data.machine}
        on:change={(e) => {
          data.update((d) => {
            d.machine = e.target.value;
            return d;
          });
        }}
      >
        <option>-</option>
        {#each QiskitMachinesTypes as m, mi}
          <option value={m.name} selected={m.name === $data.machine}>
            {m.name}
          </option>{/each}
      </select>
    </div>
    <div class="input-form">
      <label for="machine-simulator">Simulator?</label>
      <div class="checkbox-group solo">
        <input
          type="checkbox"
          id="machine-simulator"
          name="machine-simulator"
          checked={$data.is_simulator}
          disabled={$data.sim_not_choosable}
          on:change={(e) => {
            data.update((d) => {
              d.is_simulator = e.target.checked;
              return d;
            });
          }}
        />
      </div>
    </div>
    <div class="input-form">
      <label for="num_qubits"># Qubits</label><input
        type="text"
        id="num_qubits"
        name="num_qubits"
        value={$data.num_qubits || ""}
        on:change={(e) => {
          data.update((d) => {
            if (e.target.value === "auto") {
              d.num_qubits = "auto";
              d.qubits = ["auto"];
            } else {
              d.num_qubits = parseInt(e.target.value);
              d.qubits = [...Array(parseInt(e.target.value))].map((_, i) => i);
            }
            return d;
          });
        }}
      />
    </div>
    <div class="input-form">
      <label for="num_clbits"># Classical bits</label><input
        type="text"
        id="num_clbits"
        name="num_clbits"
        value={$data.num_clbits || ""}
        on:change={(e) => {
          data.update((d) => {
            if (e.target.value === "auto") {
              d.num_clbits = "auto";
              d.clbits = ["auto"];
            } else {
              d.num_clbits = parseInt(e.target.value);
              d.clbits = [...Array(parseInt(e.target.value))].map((_, i) => i);
            }
            return d;
          });
        }}
      />
    </div>
  </div>
  <div>
    <span class="note">
      The chosen machine ({$data.machine}) supports upto
      <strong>{$data.machine_qubits}</strong>
      qubits.
      {#if $data.no_machine}This machine is only available as a simulator.{:else if $data.no_sim}This
        machine cannot be used as a simulator.{/if}
      You can define as many qubits as needed, but exceeding the number of supported
      qubits can cause an error when you run a code. This information is also relevant
      if you want to set up Pauli observables. The machine part is for those who
      are less familiar with writing execution codes. If you are familiar with setting
      up a backend machine, then feel free to ignore the machien setting.
    </span>
    <span class="note">
      If you are not sure about the nubmer of qubits, type <strong>"auto"</strong> for qubits and classical bits.
    </span>
    {#if QiskitMachines[$data.machine]?.description}
      <span class="note">
        <strong>{QiskitMachines[$data.machine].description}</strong>
      </span>
    {/if}
  </div>
  {#if $data.num_qubits > $data.machine_qubits}
    <div class="warning">
      <strong>You can use up to {$data.machine_qubits} qubits.</strong>
      Currently, {$data.num_qubits} qubits are used.
    </div>
  {/if}
</article>

<style>
  article {
    padding: 1rem;
    margin-bottom: 0;
    border-top: 1px solid #ddd;
  }
  article:first-of-type {
    margin-top: 0;
    border-top: 0;
    padding-top: 0;
  }
  h4 {
    margin: 0 0 0.25rem 0;
    padding: 0 0 0.5rem 0;
    font-size: 1rem;
    line-height: 100%;
    font-weight: 600;
  }

  .input-row {
    display: flex;
    column-gap: 1rem;
    row-gap: 1rem;
    font-size: 0.9rem;
    margin-top: 0.25rem;
    margin-bottom: 0.5rem;
    max-width: 80vw;
    flex-wrap: wrap;
  }

  .input-form {
    display: flex;
  }
  .input-form > label {
    display: block;
    padding: 0.5rem 0.5rem;
    border: 1px solid #ddd;
    border-radius: 0.25rem 0 0 0.25rem;
    background-color: #f0f0f0;
    font-family: var(--font-mono);
    line-height: 100%;
  }
  .input-form > input,
  .input-form > select {
    display: block;
    /* appearance: none; */
    padding: 0.25rem 0.5rem;
    border: 1px solid #ddd;
    border-left-width: 0;
    border-radius: 0 0.25rem 0.25rem 0;
    font-family: var(--font-mono);
    line-height: 100%;
  }

  .checkbox-group {
    display: flex;
    padding: 0;
    border: 1px solid #ddd;
    border-left-width: 0;
    border-radius: 0 0.25rem 0.25rem 0;
    font-family: var(--font-mono);
    line-height: 100%;
    flex-wrap: wrap;
    max-width: 80vw;
  }
  .checkbox-group.solo {
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }
  .checkbox-group input {
    display: block;
    line-height: 100%;
  }
  .warning {
    display: inline-block;
    margin-top: 0.5rem;
    padding: 0.5rem;
    border-radius: 0.25rem;
    font-size: 0.9rem;
    line-height: 100%;
  }

  .warning {
    border: 1px solid rgb(216, 157, 6);
    background-color: rgb(255, 250, 239);
    color: rgb(143, 97, 13);
  }

  span.note {
    display: block;
    font-size: 0.8rem;
    color: #787878;
  }
</style>
