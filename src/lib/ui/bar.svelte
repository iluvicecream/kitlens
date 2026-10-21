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
		<div class="brand">
			<KitLens class="brand-icon" color="#FF3E00" size="16px" />
			<span class="brand-name">Kitlens</span>
		</div>
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

		background: transparent;
		backdrop-filter: blur(16px);
		-webkit-backdrop-filter: blur(16px);

		border-top: 1px solid rgba(21, 21, 21, 0.08);

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

	.brand {
		display: flex;
		align-items: center;
		gap: 6px;
		font-weight: 600;
		color: #ffffff;
		padding-right: 8px;
		border-right: 1px solid rgba(255, 255, 255, 0.1);
	}

	:global(.brand-icon) {
		width: 16px;
		height: 16px;
	}

	.brand-name {
		color: rgba(21, 21, 21, 1);
		font-size: 12px;
		letter-spacing: 0.5px;
	}

	.tool-btn {
		color: rgba(21, 21, 21, 0.5);
		background-color: rgba(21, 21, 21, 0.04);
		border: none;
		padding: 4px 10px;
		cursor: pointer;
		display: flex;
		align-items: center;
		transition:
			background 0.15s ease,
			border-color 0.15s ease,
			color 0.15s ease;
	}

	.tool-btn:hover {
		color: rgba(21, 21, 21, 1);
	}

	.tool-btn.active {
		background: #ff3e00;
		color: #ffffff;
	}

	.setting-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 11px;
	}

	.setting-label {
		color: rgba(21, 21, 21, 0.7);
	}

	.setting-select {
		background: rgba(21, 21, 21, 0.04);
		border: 1px solid rgba(21, 21, 21, 0.12);
		border-radius: 6px;
		padding: 2px 6px;
		font-family: inherit;
		font-size: 11px;
		color: rgba(21, 21, 21, 0.9);
		cursor: pointer;
		outline: none;
		transition:
			border-color 0.15s ease,
			background-color 0.15s ease;
	}

	.setting-select:hover {
		background: rgba(21, 21, 21, 0.08);
		border-color: rgba(21, 21, 21, 0.2);
	}

	.setting-select:focus {
		border-color: #ff3e00;
	}
</style>
