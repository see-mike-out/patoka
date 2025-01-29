<script>
	import { writable } from "svelte/store";
	import "./style.css";
	import { onMount } from "svelte";
	import { browser } from "$app/environment";
	const curr_menu = writable("main");
	curr_menu.subscribe((m) => {
		if (m === "main" && browser) {
			document.body.classList.add("main");
		} else if (browser) {
			document.body.classList.remove("main");
		}
	});

	onMount(() => {
		let p = URL.parse(window.location.href).pathname;
		if (p === "/docs") {
			curr_menu.set("docs");
		} else if (p.startsWith("/previews")) {
			curr_menu.set("previews");
		} else {
			curr_menu.set("main");
		}
	});
</script>

<header class="container">
	<nav>
		<h1>
			<a
				href="./"
				on:click={() => {
					curr_menu.set("main");
				}}>Patoka</a
			>
		</h1>
		<div class="menu">
			<a
				class={$curr_menu === "previews" ? "active" : ""}
				href="./previews"
				on:click={() => {
					curr_menu.set("previews");
				}}><span>Previews</span></a
			>
			<a
				class={$curr_menu === "docs" ? "active" : ""}
				href="./docs"
				on:click={() => {
					curr_menu.set("docs");
				}}><span>Docs</span></a
			>
			<a href="https://www.github.com/see-mike-out/patoka" target="_blank"
				><span>Github</span></a
			>
		</div>
	</nav>
</header>

	<slot />

<footer class="container">
	<div>&copy; 2025 Patoka Team</div>
</footer>

<style>
	:global(body.main) {
		background-image: url("/background.png");
		background-size: 1400px 600px;
		background-repeat: no-repeat;
		background-position: 50% 0;
	}
	header {
		padding: 0.75rem 0;
	}
	nav {
		display: flex;
		justify-content: space-between;
		height: 2.5rem;
		border-radius: 1.25rem;
		box-shadow:
			0px 0px 3px rgba(0, 0, 0, 0.1),
			0px 2px 6px rgba(0, 0, 0, 0.1);
		background: linear-gradient(
			to bottom,
			rgba(255, 255, 255, 0.8),
			rgba(255, 255, 255, 0.7) 10%,
			rgba(255, 255, 255, 0.8) 40%,
			rgba(255, 255, 255, 0.85) 80%,
			rgba(255, 255, 255, 0.8)
		);
	}
	nav h1 {
		margin: 0;
	}
	nav h1 a {
		display: block;
		padding: 0.65rem 1rem;
		font-weight: 600;
		font-size: 1.2rem;
		line-height: 100%;
		background-image: linear-gradient(
			to right,
			#53b28d,
			#0199fa,
			#b439ea,
			#b439ea
		);
		color: transparent;
		background-clip: text;
		filter: drop-shadow(0 1px 5px rgba(0, 0, 0, 0.2));
	}
	nav .menu {
		display: flex;
	}
	nav .menu a {
		display: block;
		font-size: 1rem;
		padding: 0.75rem 0.75rem;
		line-height: 100%;
		color: #121212;
		transition: 0.3s;
		font-weight: 500;
	}
	nav .menu a:hover,
	nav .menu a.active {
		background-image: linear-gradient(
			to right,
			#53b28d,
			#0199fa,
			#b439ea,
			#b439ea
		);
		color: transparent;
		background-clip: text;
	}
	nav .menu a span {
		padding-left: 0.25rem;
		padding-right: 0.25rem;
		padding-bottom: 0.1rem;
	}
	nav .menu a.active span {
		/* border-bottom: 2px solid #ff081f; */

		border-bottom-width: 3px;
		border-bottom-style: solid;
		border-image: linear-gradient(to right, #53b28d, #0199fa, #b439ea, #b439ea)
			1;
	}
	footer {
		margin-bottom: 3rem;
	}
	footer div {
		width: 100%;
		text-align: center;
		font-size: 0.8rem;
		color: #999;
	}
	@media screen and (max-width: 400px) {
		:global(body.main) {
			background-size: auto 100%;
			background-repeat: no-repeat;
		}
		nav {
			padding-left: 0.5rem;
			padding-right: 0.5rem;
			height: 2.2rem;
			border-radius: 1.1rem;
		}
		nav h1 a {
			font-size: 1rem;
			padding: 0.6rem 0.5rem;
		}
		nav .menu a {
			font-size: 0.9rem;
			padding: 0.65rem 0.35rem;
		}
		nav .menu a span {
			padding-left: 0.15rem;
			padding-right: 0.15rem;
		}
	}
</style>
