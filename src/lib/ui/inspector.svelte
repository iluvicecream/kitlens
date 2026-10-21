<script lang="ts">
	import { inspector } from "#lib/inspector.svelte.js";
	import Close from "#lib/ui/icon/Close.svelte";
	import vscode from "#lib/ui/icon/vscode.svg";
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
	<div
		class="popup"
		style:top="{Math.max(8, inspector.popupPos.y + 8)}px"
		style:left="{Math.max(8, inspector.popupPos.x + 8)}px"
	>
		<div class="popup-header">
			<span class="popup-tag">{inspector.selectedTag}</span>
			<button
				class="popup-close"
				tabindex="-1"
				onclick={inspector.closePopup}
			>
				<Close class="popup-close-icon" />
			</button>
		</div>
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
				onclick={inspector.openInVsCode}
				title="Open in VS Code"
			>
				<img src={vscode} alt="vscode logo" />
				Open in VSCode
			</button>
		{/if}
	</div>
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

	.popup {
		position: fixed;
		z-index: 2147483647;

		background: white;
		border: 1px solid rgba(21, 21, 21, 0.08);

		color: rgba(21, 21, 21, 1);
		padding: 10px 12px;
		border-radius: 35px;

		display: flex;
		flex-direction: column;
		gap: 6px;
		font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
			monospace;
		font-size: 13px;
		max-width: 480px;

		corner-shape: squircle;
	}

	.popup-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
	}

	.popup-tag {
		font-weight: 600;
	}

	.popup-source {
		font-size: 11px;
		color: #cdd6f4;
		background: rgba(255, 255, 255, 0.06);
		padding: 4px 6px;
		border-radius: 4px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.popup-file {
		color: rgba(21, 21, 21, 0.36);
	}

	.popup-loc {
		color: rgba(21, 21, 21, 0.72);
	}

	.popup-close {
		background: transparent;
		color: rgba(21, 21, 21, 1);
		border: none;
		outline: none;
		border-radius: 4px;
		padding: 4px;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.popup-vscode {
		margin-top: 4px;
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
