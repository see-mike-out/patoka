<script>
  import { onMount } from "svelte";

  export let total = 0,
    curr = 0,
    width = 200,
    cumulative = false;
  let unit_width = 0;
  onMount(() => {
    if (total > 0) unit_width = width / total;
  });
</script>

<div class="f">
  <div style={`width: ${width }px;`} class="w">
    {#each { length: total } as _, i}
      <div
        style={`width: ${unit_width}px;`}
        class={`p ${cumulative ? (i <= curr ? "o" : "x") : curr == i ? "o" : "x"}`}
      ></div>
    {/each}
  </div>
  <div class="notion">
    ({curr + 1} / {total})
  </div>
</div>

<style>
  .w, .f {
    display: flex;
    flex-wrap: nowrap;
  }
  .w,
  .p,
  .notion {
    height: 0.5rem;
    box-sizing: border-box;
  }
  .p {
    display: block;
    border-width: 1px 1px 1px 0;
    border-style: solid;
    border-color: #000;
  }
  .p:first-of-type {
    border-left: 1px solid #000;
  }
  .o {
    background-color: tomato;
  }
  .notion {
    font-family: iosevka;
    font-size: 0.7rem;
    line-height: 70%;
    padding-left: 7px;
  }
</style>
