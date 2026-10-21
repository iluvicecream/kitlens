<script lang="ts">
	import { inspector } from "#lib/inspector.svelte.js";
	import KitLens from "./icon/KitLens.svelte";
	import Inspect from "#lib/ui/icon/Inspect.svelte";
	import Inspector from "#lib/ui/inspector.svelte";
</script>

<Inspector />

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
</footer>

<style>
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
		padding: 0 6px;
		box-sizing: border-box;
		font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
			monospace;
		font-size: 12px;
		user-select: none;
	}

	.bar-left {
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

	.brand-icon {
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
</style>
