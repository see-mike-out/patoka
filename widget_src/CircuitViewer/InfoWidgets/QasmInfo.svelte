<script>
  import { copyToClipboardHelper } from "../copy_helper";
  export let info;
</script>

{#if info}
  <div>
    <h2>
      QASM{info.qasm_version} for {info.title}
      <button
        on:click={(e) => {
          copyToClipboardHelper(info.qasm);
        }}>Copy</button
      >
    </h2>
    <div class="info-section">
      <pre>{info.qasm}</pre>
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

  h2 button {
    appearance: none;
    display: inline-block;
    font-size: 0.8rem;
    text-decoration: none;
    margin-left: 0.5rem;
    color: #454545;
    border: 0;
    padding: 0;
    background-color: transparent;
    cursor: pointer;
  }
  
  h2 button:hover {
    outline: 2px solid orange;
  }

  .info-section {
    padding: 0 0.5rem;
  }
</style>
