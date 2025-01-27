<script>
  import { onMount } from "svelte";
  import { writable } from "svelte/store";

  export let data = writable();
  let filter = writable({
      gates: [],
      qubits: [],
      only_used: false,
    }),
    gates = [],
    qubits = [];
  let hide1 = writable(true);
  onMount(() => {
    if ($data?.backend_properties?.gates) {
      gates = Array.from(
        new Set($data.backend_properties.gates.map((d) => d.gate)),
      );
      qubits = Array.from(
        new Set($data.backend_properties.gates.map((d) => d.qubits).flat()),
      );
    }
  });
</script>

{#if $data}
  <article class="panel qubits">
    <h4>
      Physical qubit properties
      <button on:click={(e) => hide1.set(!$hide1)}
        >{$hide1 ? "Show" : "Hide"}</button
      >
    </h4>
    <!-- filter -->
    <div class="content-wrap">
      {#if !hide1}
        <div class="filter-wrap">
          <!-- filter by gates -->
          <div>
            <label for="used">Used qubits</label>
            <input
              type="checkbox"
              checked={$filter.only_used}
              on:change={(e) => {
                filter.update((f) => {
                  f.only_used = e.target.checked;
                  return f;
                });
              }}
            />
          </div>
          <div>
            <label for="gates">Gates</label>
            <button
              on:click={(e) => {
                filter.update((f) => {
                  f.gates = [];
                  return f;
                });
              }}>&times;</button
            >
            <select
              class="filter"
              name="gates"
              id="gates"
              multiple
              on:change={(e) => {
                filter.update((f) => {
                  f.gates = Array.from(e.target.selectedOptions).map(
                    (x) => x.value,
                  );
                  return f;
                });
              }}
            >
              {#each gates as g}
                <option value={g} selected={$filter.gates.includes(g)}
                  >{g}</option
                >
              {/each}
            </select>
          </div>
          <div>
            <label for="qubits">Qubits</label>
            <button
              on:click={(e) => {
                filter.update((f) => {
                  f.qubits = [];
                  return f;
                });
              }}>&times;</button
            >
            <select
              class="filter"
              name="qubits"
              id="qubits"
              multiple
              on:change={(e) => {
                filter.update((f) => {
                  f.qubits = Array.from(e.target.selectedOptions).map((x) =>
                    parseInt(x.value),
                  );
                  return f;
                });
              }}
            >
              {#each qubits as g}
                <option value={g} selected={$filter.qubits.includes(g)}
                  >{g}</option
                >
              {/each}
            </select>
          </div>
          <!-- filter by qubits -->
        </div>
        <div class="value">
          {#if $data.backend_properties?.gates}
            <table>
              <thead>
                <tr>
                  <th>Gate</th>
                  <th>Qubits</th>
                  <th>Error</th>
                  <th>Length</th>
                </tr>
              </thead>
              <tbody>
                {#each $data.backend_properties.gates as gate, gi}
                  {#if (!$filter.gates || $filter.gates?.length == 0 || ($filter.gates && $filter.gates.includes(gate.gate))) && (!$filter.qubits || $filter.qubits?.length == 0 || ($filter.qubits && gate.qubits.some( (q) => filter.qubits.includes(q), ))) && (!$filter.only_used || ($filter.only_used && $data.physical_gates.some((g) => g.gate === gate.gate && g.qubits.join("-") === gate.qubits.join("-"))))}
                    <tr>
                      <th>{gate.gate}</th>
                      <td>{gate.qubits.join(",")}</td>
                      <td>
                        {gate.parameters.gate_error?.value}<br />
                        <span class="asof"
                          >{gate.parameters.gate_error?.asof}</span
                        >
                      </td>
                      <td>
                        {gate.parameters.gate_length?.value} ({gate.parameters
                          .gate_length.unit})<br />
                        <span class="asof"
                          >{gate.parameters.gate_length?.asof}</span
                        >
                      </td>
                    </tr>
                  {/if}
                {/each}
              </tbody>
            </table>
          {/if}
        </div>
      {/if}
    </div>
  </article>
{/if}

<style>
  .panel {
    grid-column: span 3;
  }
  .panel .content-wrap {
    max-height: 300px;
    overflow-y: scroll;
    font-size: 0.9rem;
    margin: 0.5rem;
    padding: 0;
    display: flex;
    column-gap: 0.5rem;
  }
  .filter-wrap {
    position: sticky;
    top: 0;
  }
  .filter-wrap div {
    margin-bottom: 0.5rem;
  }
  .filter-wrap div label {
    font-size: 0.9rem;
    margin-bottom: 0.25rem;
  }
  .filter-wrap div button {
    appearance: none;
    border: 0;
    background-color: transparent;
    cursor: pointer;
    border-radius: 0.25rem;
    line-height: 100%;
  }
  .filter-wrap div button:hover {
    color: red;
    background-color: rgba(255, 0, 0, 0.05);
  }
  .filter {
    display: block;
    width: 60px;
    font-size: 0.9rem;
    font-family: var(--font-mono);
    border: 1px solid #ddd;
    border-radius: 0.25rem;
  }

  .panel table {
    border-collapse: collapse;
  }
  .panel table th {
    text-align: left;
    padding-right: 0.5rem;
    padding-left: 0;
  }
  .panel table th,
  .panel table td {
    border: 0;
    padding-top: 0.15rem;
    padding-bottom: 0.15rem;
  }
  .panel table thead {
    position: sticky;
    top: 0;
    z-index: 9;
  }
  .panel table thead th {
    text-align: center;
    background-color: #fafafa;
  }
  .panel table th,
  .panel table td {
    border: 1px solid #999;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }

  .panel th button {
    padding: 0.15rem 0.25rem;
    appearance: none;
    border: 0;
    background-color: transparent;
    cursor: pointer;
    border-radius: 0.25rem;
    line-height: 100%;
  }
  .panel th button:hover {
    background-color: rgba(0, 0, 0, 0.15);
  }
  .panel td span {
    display: block;
  }
  .asof {
    color: #999;
    font-size: 0.8rem;
  }
</style>
