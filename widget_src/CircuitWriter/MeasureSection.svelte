<script>
  import { writable } from "svelte/store";
  import QubitSelect from "./QubitSelect.svelte";

  let measure_warning = writable();
  export let data = writable({});
</script>

<article class={$data.num_clbits && $data.num_qubits ? "" : "deactive"}>
  <h4>3a. Measure</h4>
  <div class="content-wrap">
    <div class="input-row">
      <div class="input-form">
        <label>Qubits to measure</label>
        <div class="checkbox-group">
          <QubitSelect
            id={`measure-reset`}
            checked={false}
            oncheck={(new_state) => {
              data.update((d) => {
                d.measure_all = false;
                d.measure = [];
                return d;
              });
            }}
            label="Reset"
          ></QubitSelect>
          <QubitSelect
            id={"measure-all"}
            checked={$data.measure_all}
            deactive={!(
              $data.num_qubits &&
              $data.num_clbits &&
              $data.num_clbits >= $data.num_qubits
            )
              ? "deactive"
              : ""}
            oncheck={(new_state) => {
              data.update((d) => {
                d.measure_all = new_state;
                return d;
              });
            }}
            label="All"
          ></QubitSelect>

          {#each $data.qubits || [] as item}
            <QubitSelect
              id={"measure-" + item}
              checked={$data.measure?.includes(item)}
              oncheck={(new_state) => {
                data.update((d) => {
                  if (!d.measure) d.measure = [];
                  measure_warning.set();
                  if (new_state && !d.measure.includes(item)) {
                    if (d.num_clbits <= d.measure?.length) {
                      measure_warning.set(
                        `More classical bits are needed to measure the qubit ${item}.`,
                      );
                      return d;
                    }
                    d.measure.push(item);
                  } else if (!new_state && d.measure.includes(item)) {
                    d.measure.splice(d.measure.indexOf(item), 1);
                  }
                  if (d.num_clbits >= d.measure?.length) {
                    measure_warning.set();
                  }
                  return d;
                });
              }}
              label={item}
            ></QubitSelect>
          {/each}
        </div>
      </div>
    </div>
  </div>
  {#if $measure_warning}
    <div class="warning">
      {$measure_warning}
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

  .content-wrap {
    /* max-height: 35vh; */
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
  .input-form > input {
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
    /* column-gap: 1rem; */
    padding: 0;
    border: 1px solid #ddd;
    border-left-width: 0;
    border-radius: 0 0.25rem 0.25rem 0;
    font-family: var(--font-mono);
    line-height: 100%;
    flex-wrap: wrap;
    max-width: 80vw;
    /* overflow-x: scroll; */
  }
  .checkbox-group.solo {
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }
  .checkbox-item {
    display: flex;
    align-items: center;
    /* border-left: 1px solid #ddd; */
    padding: 0.25rem 0.5rem;
  }
  .checkbox-item:first-of-type {
    border-left: 0;
  }
  .checkbox-group input {
    display: block;
    line-height: 100%;
  }
  .checkbox-group label {
    display: block;
    font-family: var(--font-mono);
    line-height: 100%;
    padding-left: 0.25rem;
    padding-right: 0.25rem;
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
  .header-button-group {
    padding-left: 0.5rem;
    line-height: 100%;
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

  .warning,
  .success {
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

  .success {
    border: 1px solid rgb(11, 153, 66);
    background-color: rgb(243, 255, 239);
    color: rgb(16, 103, 68);
  }
</style>
