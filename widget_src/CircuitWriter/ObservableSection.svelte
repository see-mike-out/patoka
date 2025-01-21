<script>
  import { writable } from "svelte/store";
  import { generate_pauli_permutation } from "./pauli_permute";

  let pauli_warning = writable();
  export let data = writable({});
</script>

<article class={$data.num_qubits ? "" : "deactive"}>
  <h4>
    3b. Pauli Observables
    <span class="note"
      >{$data?.num_pauli_obs} active pauli observables{$data?.num_pauli_obs == 1
        ? ""
        : "s"}.</span
    >
    <span class="note"
      >Strongly recommend to set up the machine first because Pauli operators
      should be defined for all the qubits in the machine.</span
    >
  </h4>
  <div class="content-wrap">
    {#each $data.pauli_obs || [] as pauli, pi}
      <div class="op-wrap">
        <h5>
          {pauli.deactive ? "[Deactive]" : ""} Observable {pi + 1}. ({pauli.observable})
          <span class="header-button-group">
            {#if !pauli.deactive}
              <button
                on:click={(e) => {
                  data.update((d) => {
                    d.pauli_obs[pi].deactive = true;
                    return d;
                  });
                }}>⊗ Deactivate</button
              >
            {/if}
            {#if pauli.deactive}
              <button
                on:click={(e) => {
                  data.update((d) => {
                    d.pauli_obs[pi].deactive = false;
                    return d;
                  });
                }}>⊚ Activate</button
              >
            {/if}
            <button
              on:click={(e) => {
                data.update((d) => {
                  d.pauli_obs.splice(pi, 1);
                  return d;
                });
              }}>× Remove</button
            >
            {#if pi > 0}
              <button
                on:click={(e) => {
                  data.update((d) => {
                    [d.pauli_obs[pi], d.pauli_obs[pi - 1]] = [
                      d.pauli_obs[pi - 1],
                      d.pauli_obs[pi],
                    ];
                    return d;
                  });
                }}>↑ Move up</button
              >
            {/if}
            {#if pi < $data.pauli_obs.length - 1}
              <button
                on:click={(e) => {
                  data.update((d) => {
                    [d.pauli_obs[pi], d.pauli_obs[pi + 1]] = [
                      d.pauli_obs[pi + 1],
                      d.pauli_obs[pi],
                    ];
                    return d;
                  });
                }}>↓ Move down</button
              >
            {/if}
          </span>
        </h5>
        <div class="pauli-input-row">
          <div class="pauli-input">
            <label for={`pauli-obs-${pi}`} class="pauli-label"
              >{#each { length: $data.machine_qubits ? $data.machine_qubits : $data.num_qubits } as _, xi}{xi >
                0
                  ? " | "
                  : ""}{xi}{/each}</label
            >
            <input
              type="text"
              class="pauli-input-form"
              id={`pauli-obs-${pi}`}
              name={`pauli-obs-${pi}`}
              value={$data.pauli_obs[pi].observable}
              pattern={`[iIxXyYzZ]${$data.machine_qubits ? `{${$data.machine_qubits}}` : "+"}`}
              style={`width: ${$data.pauli_obs[pi].observable.length * 2}rem; letter-spacing: 1rem;`}
              on:change={(e) => {
                data.update((d) => {
                  let p = e.target.value.toUpperCase();
                  let pattern = `[iIxXyYzZ]${$data.machine_qubits ? `{${$data.machine_qubits}}` : "+"}`;
                  if (!d.pauli_obs[pi]) d.pauli_obs[pi] = {};
                  if (p.match(new RegExp(pattern, "g"))) {
                    d.pauli_obs[pi].observable = p;
                    pauli_warning.set();
                  } else {
                    d.pauli_obs[pi].observable = d.pauli_obs[pi].observable;
                    pauli_warning.set(
                      e.target.value + " is not an allowed Pauli operator.",
                    );
                  }
                  return d;
                });
              }}
            />
            <span class="validity"></span>
          </div>
        </div>
      </div>
    {/each}
  </div>
  <div class="input-row">
    <button
      on:click={(e) => {
        data.update((d) => {
          if (!d.pauli_obs) d.pauli_obs = [];
          let n_bits = $data.machine_qubits
            ? $data.machine_qubits
            : $data.num_qubits;
          d.pauli_obs.push("I".repeat(n_bits));
          return d;
        });
      }}>Add a Pauli observable</button
    >
    <button
      on:click={(e) => {
        data.update((d) => {
          if (!d.pauli_obs) d.pauli_obs = [];
          let n_bits = $data.machine_qubits
            ? $data.machine_qubits
            : $data.num_qubits;
          let valid_bits = $data.num_qubits;
          let permutations = generate_pauli_permutation(n_bits, valid_bits);
          d.pauli_obs = permutations.map((d) => ({ observable: d }));
          return d;
        });
      }}>Generate Pauli obersvable permutations</button
    >
  </div>
  <span class="note">
    Allowed opeartors: I/X/Y/Z (case-insensitive). If you have more than a few
    qubits, avoid generating permutations because it can delay the process.
  </span>

  {#if $pauli_warning}
    <div class="warning">
      <strong>Warning:</strong>
      {$pauli_warning}
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

  h5 {
    margin: 0 0 0.25rem 0;
    padding: 0.15rem 0 0.15rem 0;
    font-size: 0.9rem;
    line-height: 100%;
    font-weight: 600;
    font-style: italic;
    color: #454545;
  }

  .content-wrap {
    overflow-y: scroll;
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

  .pauli-input-row {
    /* display: flex;
    flex-wrap: nowrap; */
    margin-bottom: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 0.25rem;
    width: fit-content;
    /* min-width: 30vw; */
    max-width: 80vw;
    overflow-x: scroll;
    /* column-gap: 0.25rem; */
  }
  .pauli-input {
    padding: 0.25rem;
  }
  .pauli-input label,
  .pauli-input input {
    display: block;
    font-family: var(--font-mono);
    font-size: 0.9rem;
    text-align: center;
    /* width: 1.5rem; */
    padding: 0;
    letter-spacing: 0.15rem;
  }
  .pauli-input label {
    padding-bottom: 0.25rem;
    font-weight: 700;
  }
  .pauli-input input {
    border: 0;
    border-bottom: 1px solid #ddd;
  }

  .pauli-input > input:invalid {
    border-color: #ff0000;
  }
  .pauli-input > input:invalid + span::after {
    display: block;
    content: "✖";
    padding-top: 0.25rem;
    text-align: center;
  }
  .pauli-input > input:valid + span::after {
    display: block;
    content: "✓";
    padding-top: 0.25rem;
    text-align: center;
  }

  button {
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 0.25rem;
    background-color: #f0f0f0;
    font-family: var(--font-mono);
  }
  .input-row button {
    display: block;
  }
  .header-button-group {
    padding-left: 0.5rem;
    line-height: 100%;
  }
  .header-button-group button {
    line-height: 100%;
    padding: 0.25rem 0.5rem;
  }

  .op-wrap {
    margin-top: 1.25rem;
  }
  .op-wrap:first-of-type {
    margin-top: 0;
  }

  .deactive * {
    opacity: 0.5;
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

  h4 span.note {
    margin-top: 0.25rem;
    font-weight: 400;
  }
</style>
