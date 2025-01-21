<script>
  import { writable } from "svelte/store";
  import EspInfo from "./InfoWidgets/ESPInfo.svelte";
  import GateErrorInfo from "./InfoWidgets/GateErrorInfo.svelte";
  import GateInfo from "./InfoWidgets/GateInfo.svelte";
  import QubitGateInfo from "./InfoWidgets/QubitGateInfo.svelte";
  import QubitInfo from "./InfoWidgets/QubitInfo.svelte";
  import ReadoutErrorInfo from "./InfoWidgets/ReadoutErrorInfo.svelte";
  import QasmInfo from "./InfoWidgets/QasmInfo.svelte";
  import PulseInfo from "./InfoWidgets/PulseInfo.svelte";

  export let info,
    machine_moment_at = writable();
</script>

<div>
  {#if info}
    {#if info.qubit}
      <article>
        <QubitInfo {info}></QubitInfo>
      </article>
    {/if}
    {#if info.operation}
      <article>
        <GateInfo {info}></GateInfo>
      </article>
    {/if}
    {#if info.readout_error}
      <article>
        <ReadoutErrorInfo {info} {machine_moment_at}></ReadoutErrorInfo>
      </article>
    {/if}
    {#if info.gate_info}
      <article>
        <QubitGateInfo {info}></QubitGateInfo>
      </article>
    {/if}
    {#if info.gate_error_info}
      <article>
        <GateErrorInfo {info}></GateErrorInfo>
      </article>
    {/if}
    {#if info.esp_this}
      <article>
        <EspInfo {info}></EspInfo>
      </article>
    {/if}
    {#if info.qasm}
      <article>
        <QasmInfo {info}></QasmInfo>
      </article>
    {/if}
    {#if info.pulse_data}
      <article>
        <PulseInfo {info}></PulseInfo>
      </article>
    {/if}
  {/if}
</div>

<style>
  div {
    font-size: 12px;
  }
  article {
    border-bottom: 1px solid #ddd;
  }
  article:last-of-type {
    border-bottom: 0;
  }
</style>
