<script>
  import { writable } from "svelte/store";
  import { onMount } from "svelte";
  import SvgWrap from "../../CircuitViewer/svgs/SVGWrap.svelte";

  export let drawPlan = writable(),
    id = "image-view",
    problem_type = writable();

  onMount(() => {
    console.log($drawPlan);
  });
</script>

<div class="content-wrap">
  {#if $drawPlan?.groups}
    <div
      id={id + "-wrapper"}
      class="image-view-wrapper"
      style="position: relative; width: 100%; overflow-x: scroll; overflow-y:hidden;"
    >
      <div class="image-view-main">
        <svg
          {id}
          width={$drawPlan.width}
          height={$drawPlan.height}
          viewBox={$drawPlan.viewBox.join(" ")}
        >
          <style>
            g {
              font-family: Iosevka;
              font-size: 14px;
            }
          </style>
          {#if $drawPlan.groups.image_group}
            <SvgWrap data={$drawPlan.groups.image_group}></SvgWrap>
          {/if}
        </svg>
      </div>
    </div>
  {/if}
</div>

<style>
</style>
