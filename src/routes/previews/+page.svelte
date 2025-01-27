<script>
  import { browser } from "$app/environment";
  import { onMount } from "svelte";
  import { writable } from "svelte/store";
  import CircuitWriter from "./CircuitWriter/CircuitWriter.svelte";
  import CircuitViewer from "./CircuitViewer/CircuitViewer.svelte";
  import MachineViewer from "./MachineViewer/MachineViewer.svelte";
  import ResultViewer from "./ResultViewer/ResultViewer.svelte";
  import Cart from "./MachineViewer/Cart.svelte";
  import Clock from "./MachineViewer/Clock.svelte";

  const curr_menu = writable("");

  const menus = [
      {
        key: "writer",
        title: "Circuit Writer",
      },
      {
        key: "viewer",
        title: "Circuit Viewer",
      },
      {
        key: "machine",
        title: "Machine Explorer",
      },
      {
        key: "job",
        title: "Result Viewer",
      },
    ],
    menu_keys = menus.map((d) => d.key);

  onMount(() => {
    if (browser) {
      document.body.classList.remove("main");
    }

    let p = URL.parse(window.location.href);
   let  w = p.searchParams.get("widget");
    if (menu_keys.includes(w)) {
      curr_menu.set(w);
    } else {
      window.location.href = p.origin + p.pathname + "?widget=writer";
    }
  });
</script>

<div class="container">
  <nav id="submenu">
    {#each menus as menu}
      <a
        class={$curr_menu === menu.key ? "active" : ""}
        href={"previews/?widget=" + menu.key}
        on:click={() => {
          curr_menu.set(menu.key);
        }}>{menu.title}</a
      >
    {/each}
  </nav>
  <p class="note">
    Note: This widgets are intended for Jupyter Lab (or Notebook) on desktop
    screens, so they may not appear properly on mobile screens or smaller
    windows.
  </p>
  {#if $curr_menu === "machine"}
    <p class="note">
      Note: By clicking a cart icon (<Cart on={false}></Cart>), you can generate
      reusable codes for the corresponding property. By clicking a time machine
      icon(<Clock></Clock>), you can check the historical properties.
    </p>
  {/if}
</div>
<div class="container-max">
  {#if $curr_menu === "writer"}
    <CircuitWriter></CircuitWriter>
  {:else if $curr_menu === "viewer"}
    <CircuitViewer></CircuitViewer>
  {:else if $curr_menu === "machine"}
    <MachineViewer></MachineViewer>
  {:else if $curr_menu === "job"}
    <ResultViewer></ResultViewer>
  {/if}
</div>

<style>
  nav#submenu {
    width: 100%;
    margin-top: 1rem;
    margin-bottom: 1rem;
    display: flex;
    justify-content: stretch;
  }
  nav#submenu a {
    display: block;
    padding: 0.25rem;
    width: 25%;
    text-align: center;
    color: #222;
    border-top: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
    border-left: 1px solid #ddd;
  }
  nav#submenu a:first-of-type {
    border-radius: 0.25rem 0 0 0.25rem;
  }
  nav#submenu a:last-of-type {
    border-radius: 0 0.25rem 0.25rem 0;
    border-right: 1px solid #ddd;
  }
  nav#submenu a.active {
    font-weight: 600;
    background-color: #efefef;
  }
  p.note {
    font-size: 0.85rem;
    color: #666;
  }
  @media screen and (max-width: 600px) {
    nav#submenu a {
      font-size: 0.9rem;
    }
  }
  .container-max {
    font-family: initial;
  }
</style>
