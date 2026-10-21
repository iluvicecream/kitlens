<script lang="ts">
	import { inspector } from "#lib/inspector.svelte.js";
	import { settings } from "#lib/settings.svelte.js";
	import vscode from "#lib/ui/icon/ide/vscode.svg";
	import antigravity from "#lib/ui/icon/ide/antigravity.svg";
	import Popup from "#lib/ui/popup.svelte";

	const ideIcons = {
		vscode: vscode,
		antigravity: antigravity,
	};
</script>

<svelte:window
	onpointermove={inspector.handlePointerMove}
	onclickcapture={inspector.handleClick}
	onkeydown={inspector.handleKeyDown}
/>

{#if inspector.active && inspector.hoveredTag && inspector.rect}
	<div
		class="highlight"
		style:top="{inspector.rect.top}px"
		style:left="{inspector.rect.left}px"
		style:width="{inspector.rect.width}px"
		style:height="{inspector.rect.height}px"
	></div>
	<div
		class="tooltip"
		style:top="{Math.max(8, inspector.pointer.y - 32)}px"
		style:left="{inspector.pointer.x + 12}px"
	>
		{inspector.hoveredTag}
	</div>
{/if}

{#if inspector.selectedTag}
	<Popup
		title={inspector.selectedTag}
		style="top: {Math.max(8, inspector.popupPos.y + 8)}px; left: {Math.max(
			8,
			inspector.popupPos.x + 8,
		)}px; max-width: 480px;"
		onClose={inspector.closePopup}
		closeOnOutsideClick
	>
		{#if inspector.selectedFilePath}
			<div
				class="popup-source"
				title="{inspector.selectedFilePath}{inspector.selectedLine
					? `:${inspector.selectedLine}`
					: ''}"
			>
				<span class="popup-file">{inspector.displayFilePath}</span
				>{#if inspector.selectedLine}<span class="popup-loc"
						>:{inspector.selectedLine}{#if inspector.selectedColumn}:{inspector.selectedColumn}{/if}</span
					>{/if}
			</div>
			<button
				class="popup-vscode"
				tabindex="-1"
				onclick={inspector.openInIde}
				title="Open in {settings.currentIdeConfig.name}"
			>
				<img
					src={ideIcons[settings.ide]}
					alt="{settings.currentIdeConfig.name} logo"
				/>
				Open in {settings.currentIdeConfig.name}
			</button>
		{/if}
	</Popup>
{/if}

<style>
	.highlight {
		position: fixed;
		z-index: 2147483646;
		pointer-events: none;
		border: 2px solid #ff3e00;
		background: rgba(255, 62, 0, 0.1);
		border-radius: 4px;
		box-sizing: border-box;
	}

	.tooltip {
		position: fixed;
		z-index: 2147483647;
		pointer-events: none;

		border: 1px solid rgba(21, 21, 21, 0.08);
		background-color: white;
		color: rgba(21, 21, 21, 1);

		font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
			monospace;
		font-size: 12px;
		font-weight: 600;

		line-height: 1;

		padding: 6px 8px;

		border-radius: 200px;
		white-space: nowrap;
		corner-shape: squircle;
	}

	.popup-source {
		font-size: 11px;
		color: rgba(21, 21, 21, 0.85);
		background: rgba(21, 21, 21, 0.04);
		border: 1px solid rgba(21, 21, 21, 0.06);
		padding: 4px 6px;
		border-radius: 4px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.popup-file {
		color: rgba(21, 21, 21, 0.5);
	}

	.popup-loc {
		color: rgba(21, 21, 21, 0.85);
		font-weight: 600;
	}

	.popup-vscode {
		background: rgba(255, 255, 255, 1);
		color: rgba(21, 21, 21, 1);
		border: 1px solid rgba(21, 21, 21, 0.08);
		border-radius: 6px;
		padding: 6px 10px;
		font-family: inherit;
		font-size: 12px;
		font-weight: 500;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 6px;
		transition:
			background 0.15s ease,
			border-color 0.15s ease,
			color 0.15s ease;
	}

	.popup-vscode img {
		width: 12px;
		height: 12px;
	}

	.popup-vscode:hover {
		background: rgba(21, 21, 21, 0.08);
		border-color: rgba(21, 21, 21, 0.2);
		color: rgba(21, 21, 21, 1);
	}
</style>
