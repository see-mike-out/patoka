<script>
  import { beforeUpdate, onDestroy, onMount } from "svelte";
  import { tweened } from "svelte/motion";

  export let duration = 100,
    width = 200;

  let progress;

  onMount(() => {
    progress = tweened(0, {
      duration,
    });
    $progress = duration;
  });

  $: {
    progress = tweened(0, {
      duration,
    });
    $progress = duration;
  }
</script>

<div class="f">
  <div style={`width: ${width}px;`} class="w">
    <div class="b"></div>
    <div
      class="p"
      style={`width: ${duration == 0 ? width : ($progress / duration) * width}px`}
    ></div>
  </div>
  <div class="notion">
    {duration == 0 ? "100" : Math.round(($progress / duration) * 10000) / 100}%
    ({duration.toString().slice(0, 7)}ns)
  </div>
</div>

<style>
  .f {
    display: flex;
    flex-wrap: nowrap;
  }
  .w {
    position: relative;
    height: 0.5rem;
  }
  .b,
  .p {
    position: absolute;
    top: 0;
    left: 0;
    height: 0.5rem;
    box-sizing: border-box;
    border: 1px solid #000;
    display: block;
  }
  .b {
    z-index: 0;
  }
  .p {
    background-color: tomato;
    z-index: 9;
  }
  .notion {
    font-family: iosevka;
    font-size: 0.7rem;
    line-height: 70%;
    padding-left: 7px;
  }
</style>
