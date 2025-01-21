<script>
  import ArrowEnd from "./ArrowEnd.svelte";
  import Circle from "./Circle.svelte";
  import ClickWrap from "./ClickWrap.svelte";
  import DoubleLine from "./DoubleLine.svelte";
  import G from "./G.svelte";
  import Line from "./Line.svelte";
  import Rect from "./Rect.svelte";
  import Text from "./Text.svelte";
  import X from "./X.svelte";
  import Path from "./Path.svelte";

  export let data = {},
    open_tool = () => {},
    openTooltip = () => {},
    closeTooltip = () => {},
    moveTooltip = () => {};
</script>

{#if data?.type === "g"}
  <G {data} {open_tool} {openTooltip} {closeTooltip} {moveTooltip}></G>
{:else if data?.type === "click-wrap"}
  <ClickWrap {data} {open_tool}></ClickWrap>
{:else if data?.type === "line"}
  <Line {data}></Line>
{:else if data?.type === "double-line"}
  <DoubleLine {data}></DoubleLine>
{:else if data?.type === "rect"}
  <Rect {data}></Rect>
{:else if data?.type === "circle"}
  <Circle {data}></Circle>
{:else if data?.type === "arrow-end"}
  <ArrowEnd {data}></ArrowEnd>
{:else if data?.type === "text"}
  <Text {data}></Text>
{:else if data?.type === "x"}
  <X {data}></X>
{:else if data?.type === "path"}
  <Path {data}></Path>
{/if}

<style>
  /* :global(.layer-wrap:hover .interation-wrap) {
    fill: rgba(0, 0, 0, 0.1);
  } */
</style>
