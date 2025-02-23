<script>
  import { format } from "d3";
  import { writable } from "svelte/store";

  export let data = writable();
</script>

{#if $data}
  <article class="panel">
    <h4>Job metadata</h4>
    <div class="content-wrap">
      <table>
        {#if $data.job_id}
          <tr>
            <th>Job ID</th><td>{$data.job_id}</td>
          </tr>
        {/if}
        {#if $data.creation_date}
          <tr>
            <th>Job created</th><td>{$data.creation_date}</td>
          </tr>
        {/if}
        {#if $data.done !== undefined}
          <tr>
            <th>Job done?</th><td>{$data.done ? "Done" : "Running"}</td>
          </tr>
        {/if}
        {#if $data.program_id}
          <tr>
            <th>Program ID</th><td>{$data.program_id}</td>
          </tr>
        {/if}
      </table>
    </div>
  </article>
  <article class="panel">
    <h4>Usage size</h4>
    <div class="content-wrap">
      <table>
        {#if $data.n_shots !== undefined}
          <tr>
            <th># Shots</th><td>{$data.n_shots}</td>
          </tr>
        {/if}
        {#if $data.metrics?.circuit_depths !== undefined}
          <tr>
            <th>Circuit depth</th><td
              >{format(",d")($data.metrics.circuit_depths[0])}</td
            >
          </tr>
        {/if}
        {#if $data?.physical_qubits}
          <tr>
            <th># Qubits</th><td>{$data.physical_qubits?.length}</td>
          </tr>
        {/if}
      </table>
    </div>
  </article>
  <article class="panel">
    <h4>Usage information</h4>
    <div class="content-wrap">
      <table>
        {#if $data.est_start_time}
          <tr>
            <th>Start time (est)</th><td>{$data.est_start_time}</td>
          </tr>
        {/if}
        {#if $data.metrics?.usage?.quantum_seconds !== undefined && $data.metrics?.usage?.seconds !== undefined}
          <tr>
            <th>Duration (sec.) </th><td
              >{$data.metrics.usage.quantum_seconds} (quantum) / {$data.metrics
                .usage.seconds} (total)</td
            >
          </tr>
        {/if}
        {#if $data.init_qubits !== undefined}
          <tr>
            <th>Qubits initialized</th><td>{$data.init_qubits}</td>
          </tr>
        {/if}
        {#if $data.backend_name}
          <tr>
            <th>Backend name</th><td>{$data.backend_name}</td>
          </tr>
        {/if}
      </table>
    </div>
  </article>
{/if}

<style>
  .panel {
    grid-column: span 2;
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
</style>
