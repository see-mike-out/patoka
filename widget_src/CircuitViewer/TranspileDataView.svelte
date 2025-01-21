<script>
  import { onMount } from "svelte";

  export let backend, params;
  let show = true;
</script>

<div class="machine-info-wrap">
  <h3>
    Machine & transpilation information <button
      on:click={() => {
        show = !show;
      }}>{show ? "Close" : "Open"}</button
    >
  </h3>
  {#if show}
    <table>
      {#if backend?.machine_data}
        <tr>
          <th>Backend</th>
          <td>
            {backend?.machine_data?.backend_name} ({backend?.machine_data
              ?.backend_version})
          </td>
        </tr>
        <tr>
          <th>Supported Gates</th>
          <td>
            {backend?.machine_data?.gates.map((d) => d.name).join(", ")}
          </td>
        </tr>
      {/if}
      {#if params}
        {#each Object.keys(params) as key}
          {#if params[key] != undefined && params[key] !== false && params[key] !== "default"}
            <tr>
              <th>{key}</th>
              <td>
                {params[key]}
              </td>
            </tr>
          {/if}
        {/each}
      {/if}
    </table>
  {/if}
</div>

<style>
  .machine-info-wrap {
    padding: 0;
    font-size: 0.8rem;
  }
  h3 {
    font-size: 0.8rem;
    margin: 0;
    padding: 0.5rem;
    line-height: 100%;
    font-weight: 600;
    border-bottom: 1px solid #ddd;
  }
  h3 button {
    appearance: none;
    cursor: pointer;
    background-color: transparent;
    border: 0;
    padding: 0;
    font-size: 0.7rem;
    margin: 0 0 0 1rem;
  }
  table {
    font-family: iosevka;
    border-collapse: collapse;
    width: 100%;
  }
  table th {
    font-weight: 600;
    text-align: right;
    padding-left: 0.5rem;
    width: 120px;
  }
  table th,
  table td {
    border-bottom: 1px solid #ddd;
    padding-top: 0.35rem;
    padding-bottom: 0.35rem;
    line-height: 100%;
  }
  table td {
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }
</style>
