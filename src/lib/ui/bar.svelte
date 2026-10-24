<svelte:options css="injected" />

<script lang="ts">
	import { inspector } from "../inspector.svelte.js";
	import { settings } from "../settings.svelte.js";
	import { SUPPORTED_IDES, type IDE } from "../ide-deeplink.js";
	import KitLens from "./icon/KitLens.svelte";
	import Inspect from "./icon/Inspect.svelte";
	import Settings from "./icon/Settings.svelte";
	import Inspector from "./inspector.svelte";
	import Popup from "./popup.svelte";

	let settingsOpen = $state(false);

	function toggleSettings() {
		settingsOpen = !settingsOpen;
	}

	function closeSettings() {
		settingsOpen = false;
	}
</script>

<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" />
	<link
		href="https://fonts.googleapis.com/css2?family=Google+Sans+Flex:opsz,slnt,wdth,wght,ROND@1..144,0,25..151,1..1000,0..100&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<Inspector />

{#if settingsOpen}
	<Popup
		title="Settings"
		style="bottom: 30px; right: 8px; width: 250px;"
		onClose={closeSettings}
		closeOnOutsideClick
		ignoreOutsideSelector=".settings-toggle-btn"
	>
		{#snippet icon()}
			<Settings size="14px" />
		{/snippet}

		<div class="setting-item">
			<label class="setting-label" for="kitlens-ide-select">Editor</label>
			<select
				id="kitlens-ide-select"
				class="setting-select"
				value={settings.ide}
				onchange={(e) => settings.setIde(e.currentTarget.value as IDE)}
			>
				{#each Object.values(SUPPORTED_IDES) as item}
					<option value={item.id}>{item.name}</option>
				{/each}
			</select>
		</div>
	</Popup>
{/if}

<footer class="bottom-bar">
	<div class="bar-left">
		<span class="brand-name">KITLENS</span>

		<button
			class="tool-btn"
			class:active={inspector.active}
			tabindex="-1"
			onmousedown={(e) => e.preventDefault()}
			onclick={inspector.toggle}
			aria-pressed={inspector.active}
			title="Toggle element inspector (pointer mode)"
		>
			<Inspect class="tool-icon" />
		</button>
	</div>
	<div class="bar-right">
		<button
			class="tool-btn settings-toggle-btn"
			class:active={settingsOpen}
			tabindex="-1"
			onmousedown={(e) => e.preventDefault()}
			onclick={toggleSettings}
			aria-pressed={settingsOpen}
			title="Settings"
		>
			<Settings class="tool-icon" />
		</button>
	</div>
</footer>

<style>
	:global(:host) {
		all: initial;
	}

	.bottom-bar {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		height: 24px;
		z-index: 2147483647;

		background: #ff6a00;

		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0px 0px 0px 8px;
		box-sizing: border-box;
		font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
			monospace;
		font-size: 12px;
		user-select: none;
	}

	.bar-left,
	.bar-right {
		display: flex;
		align-items: center;
		gap: 12px;
	}

	.brand-name {
		color: #fff;
		font-family: "Google Sans Flex", sans-serif;
		font-weight: 1000;
		font-variation-settings:
			"slnt" 0,
			"wdth" 120,
			"opsz" 72,
			"ROND" 0;
	}

	.tool-btn {
		color: rgba(21, 21, 21, 0.5);
		background-color: rgba(21, 21, 21, 0.04);
		border: none;
		padding: 4px 10px;
		cursor: pointer;
		display: flex;
		align-items: center;
	}

	.tool-btn:hover {
		color: rgba(21, 21, 21, 1);
	}

	.tool-btn.active {
		background: black;
		color: white;
	}

	.setting-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 11px;
	}

	.setting-select {
		background: white;
		border: 1px solid rgba(21, 21, 21, 0.12);
		border-radius: 2px;
		padding: 2px 6px;
		font-family: inherit;
		font-size: 11px;
		color: rgba(21, 21, 21, 0.9);
		cursor: pointer;
		outline: none;
	}

	.setting-select:focus {
		border-color: #ff3e00;
	}
</style>
