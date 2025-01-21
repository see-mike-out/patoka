<script>
  export let info;
</script>

{#if info}
  <div>
    <h2>Gate Operation Information</h2>
    {#each info.gate_info as item}
      <!-- <h3>Gate: {item.gate}</h3> -->
      <div class="info-section">
        <table>
          <thead>
            <tr>
              <th>Gate</th><th>{item.gate}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>Qubits</th><td>{item.qubits.join(", ")}</td>
            </tr>
            {#if item.gate_error}
              <tr>
                <th>Gate error</th><td>{item.gate_error.value}</td>
              </tr>
              <tr>
                <th>As of</th><td>{item.gate_error.asof}</td>
              </tr>
            {/if}
            {#if item.gate_length}
              <tr>
                <th>Gate length</th><td
                  >{item.gate_length.value} ({item.gate_length.unit})</td
                >
              </tr>
              <tr>
                <th>As of</th><td>{item.gate_length.asof}</td>
              </tr>
            {/if}
          </tbody>
        </table>
      </div>
    {/each}
  </div>
{/if}

<style>
  * {
    box-sizing: border-box;
    line-height: 100%;
  }
  h2 {
    margin: 0;
    padding: 0.25rem 0.5rem;
    font-size: 0.85rem;
    border-bottom: 1px solid #ddd;
    line-height: 100%;
  }

  .info-section {
    padding: 0;
  }
  table {
    width: 100%;
    font-family: Iosevka;
    border-collapse: collapse;
    border-radius: 0.5rem;
  }
  table th,
  table td,
  table thead th,
  table thead td {
    border-bottom: 1px solid #ddd;
    padding: 0.35rem 0.5rem;
    text-align: left;
  }
  table thead th {
    border-top: 3px solid #ddd;
    background-color: rgba(0, 0, 0, 0.05);
  }
  table thead tr th,
  table th {
    border-right: 1px solid #ddd;
  }
  table thead tr th:last-of-type {
    border-right: 0;
  }
  table tbody th {
    width: 130px;
  }
  table tbody tr:last-of-type th,
  table tbody tr:last-of-type td {
    border-bottom: 0;
  }
</style>
