<script>
  import { writable } from "svelte/store";

  export let data = writable();
  let hide1 = writable(false),
    hide2 = writable(false),
    hide3 = writable(false);
</script>

{#if $data}
  <article class="panel meta">
    <h4>Backend information <button on:click={(e) => hide1.set(!$hide1)}>{$hide1 ? 'Show' : 'Hide'}</button></h4>
    <div class="content-wrap">
      {#if !$hide1}
        <table>
          {#if $data.machine_data?.backend_name}
            <tr>
              <th>Backend name</th><td>{$data.machine_data.backend_name}</td>
            </tr>
          {/if}
          {#if data.machine_data?.backend_version}
            <tr>
              <th>Backend version</th><td
                >{$data.machine_data.backend_version}</td
              >
            </tr>
          {/if}
          {#if data.backend_properties?.last_update_date}
            <tr>
              <th>Last updated</th><td
                >{$data.backend_properties.last_update_date}</td
              >
            </tr>
          {/if}
          {#if $data.machine_data?.basis_gates}
            <tr>
              <th>Basis gates</th><td
                >{$data.machine_data.basis_gates?.join(", ")}</td
              >
            </tr>
          {/if}
        </table>
      {/if}
    </div>
  </article>
  <article class="panel generic">
    <h4>Backend general parameters <button on:click={(e) => hide2.set(!$hide2)}>{$hide2 ? 'Show' : 'Hide'}</button></h4>
    <div class="content-wrap">
      {#if !$hide2}
        {#if $data.backend_properties?.general}
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Value</th>
                <th>Unit</th>
                <th>As of</th>
              </tr>
            </thead>
            <tbody>
              {#each Object.keys($data.backend_properties.general) as key, ki}
                <tr>
                  <th>{key}</th>
                  <td>{$data.backend_properties.general[key].value}</td>
                  <td>{$data.backend_properties.general[key].unit}</td>
                  <td>{$data.backend_properties.general[key].asof}</td>
                </tr>
              {/each}
            </tbody>
          </table>
        {/if}
      {/if}
    </div>
  </article>
  <article class="panel generic-q">
    <h4>Qubit groups <button on:click={(e) => hide3.set(!$hide3)}>{$hide3 ? 'Show' : 'Hide'}</button></h4>
    <div class="content-wrap">
      {#if !$hide3}
        {#if $data.backend_properties?.general_qlists}
          {#each $data.backend_properties.general_qlists as a_set, ai}
            <strong>{a_set.name}</strong>
            <br />
            {a_set.qubits.join(", ")}
          {/each}
        {/if}
      {/if}
    </div>
  </article>
{/if}

<style>
  .panel.meta {
    grid-column: span 2;
  }
  .panel.generic {
    grid-column: span 2;
  }
  .panel.generic-q {
    grid-column: span 2;
  }
  .panel.generic .content-wrap {
    max-height: 300px;
    overflow-y: scroll;
    font-size: 0.9rem;
    margin: 0.5rem;
    padding: 0;
  }
  .panel.generic-q .content-wrap {
    font-size: 0.8rem;
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

  .panel.generic table thead {
    position: sticky;
    top: 0;
    z-index: 9;
  }
  .panel.generic table thead th {
    text-align: center;
    background-color: #fafafa;
  }
  .panel.generic table th,
  .panel.generic table td {
    border: 1px solid #999;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }
</style>
