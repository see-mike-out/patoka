<script>
  import { onMount } from "svelte";
  import { writable } from "svelte/store";

  export let data = writable();
  let hide1 = writable(true);
  onMount(() => {});
</script>

{#if $data}
  <article class="panel qubits">
    <h4>
      Faulty gates and qubits
      <button on:click={(e) => hide1.set(!$hide1)}
        >{$hide1 ? "Show" : "Hide"}</button
      >
    </h4>
    <!-- filter -->
    <div class="content-wrap">
      {#if !$hide1}
        {#if $data.backend_properties?.faulty_gates}
          <h5>Faulty gates</h5>
          <div class="list">
            {#if $data.backend_properties.faulty_gates?.length == 0}
              None
            {:else}
              {$data.backend_properties.faulty_gates
                .map((d) => {
                  return d.gate + " (" + d.qubits.join(", ") + ")";
                })
                .join(", ")}
            {/if}
          </div>
        {/if}
        {#if $data.backend_properties?.faulty_qubits}
          <h5>Faulty qubits</h5>
          <div class="list">
            {#if $data.backend_properties.faulty_qubits?.length == 0}
              None
            {:else}
              {$data.backend_properties.faulty_qubits.join(", ")}
            {/if}
          </div>
        {/if}
      {/if}
    </div>
  </article>
{/if}

<style>
  .panel {
    grid-column: span 3;
  }
  h5 {
    display: block;
    margin: 0 0 0.5rem 0;
  }
  .panel .content-wrap {
    max-height: 300px;
    overflow-y: scroll;
    font-size: 0.9rem;
    margin: 0.5rem;
    padding: 0;
  }
  .panel .list {
    margin-bottom: 1rem;
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
