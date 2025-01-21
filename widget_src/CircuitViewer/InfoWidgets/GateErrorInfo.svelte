<script>
  export let info;
</script>

{#if info}
  <div>
    <h2>Gate Error Information</h2>
    <div class="info-section">
      <table>
        <tbody>
          <tr>
            <th>Layer</th><td>{info.gate_error_info.layer} </td>
          </tr>
          <tr>
            <th>Operation</th><td>{info.gate_error_info.operation} </td>
          </tr>
          <tr>
            <th>Gate</th><td>{info.gate_error_info.gate} </td>
          </tr>
          <tr>
            <th>Qubits</th><td>{info.gate_error_info.qubits.join(",")} </td>
          </tr>
          <tr>
            <th>Gate error</th><td>{info.gate_error_info.gate_error} </td>
          </tr>
          <tr>
            <th>Gate duration</th><td
              >{info.gate_error_info.gate_duration}
              {#if info.gate_error_info.duration_unit}({info.gate_error_info.duration_unit}){/if}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
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
  }
  table thead tr th,
  table th {
    border-right: 1px solid #ddd;
  }
  table tbody tr:last-of-type th,
  table tbody tr:last-of-type td {
    border-bottom: 0;
  }
</style>
