<svelte:options css="injected" />

<script lang="ts">
	import type { Snippet } from "svelte";
	import Close from "./icon/Close.svelte";

	interface Props {
		title?: string;
		header?: Snippet;
		icon?: Snippet;
		children?: Snippet;
		onClose?: () => void;
		x?: number;
		y?: number;
		style?: string;
		class?: string;
		closeOnOutsideClick?: boolean;
		ignoreOutsideSelector?: string;
		role?: string;
		ariaLabel?: string;
	}

	const VIEWPORT_MARGIN = 8;
	const BOTTOM_BAR_HEIGHT = 24;

	let {
		title,
		header,
		icon,
		children,
		onClose,
		x,
		y,
		style = "",
		class: className = "",
		closeOnOutsideClick = true,
		ignoreOutsideSelector = "",
		role = "dialog",
		ariaLabel
	}: Props = $props();

	let popupRef = $state<HTMLDivElement | null>(null);
	let innerWidth = $state(
		typeof window !== "undefined" ? window.innerWidth : 0
	);
	let innerHeight = $state(
		typeof window !== "undefined" ? window.innerHeight : 0
	);
	let popupWidth = $state(0);
	let popupHeight = $state(0);

	$effect(() => {
		if (!popupRef) return;

		const updateSize = () => {
			if (!popupRef) return;
			popupWidth = popupRef.offsetWidth;
			popupHeight = popupRef.offsetHeight;
		};

		updateSize();

		const observer = new ResizeObserver(updateSize);
		observer.observe(popupRef);

		return () => observer.disconnect();
	});

	let clampedLeft = $derived.by(() => {
		if (x === undefined) return undefined;
		if (!innerWidth) return Math.max(VIEWPORT_MARGIN, x);
		const maxLeft = Math.max(
			VIEWPORT_MARGIN,
			innerWidth - popupWidth - VIEWPORT_MARGIN
		);
		return Math.min(Math.max(VIEWPORT_MARGIN, x), maxLeft);
	});

	let clampedTop = $derived.by(() => {
		if (y === undefined) return undefined;
		if (!innerHeight) return Math.max(VIEWPORT_MARGIN, y);
		const maxTop = Math.max(
			VIEWPORT_MARGIN,
			innerHeight - BOTTOM_BAR_HEIGHT - popupHeight - VIEWPORT_MARGIN
		);
		return Math.min(Math.max(VIEWPORT_MARGIN, y), maxTop);
	});

	function handlePointerDown(e: PointerEvent) {
		if (!closeOnOutsideClick || !onClose || !popupRef) return;
		const path = e.composedPath();
		if (path.includes(popupRef)) return;
		if (
			ignoreOutsideSelector &&
			path.some(
				(node) =>
					node instanceof Element &&
					(node.matches(ignoreOutsideSelector) ||
						Boolean(node.closest(ignoreOutsideSelector)))
			)
		) {
			return;
		}
		onClose();
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === "Escape" && onClose) {
			e.stopPropagation();
			onClose();
		}
	}
</script>

<svelte:window
	bind:innerWidth
	bind:innerHeight
	onpointerdown={handlePointerDown}
	onkeydown={handleKeydown}
/>

<div
	bind:this={popupRef}
	class="kitlens-popup {className}"
	{style}
	style:left={clampedLeft !== undefined ? `${clampedLeft}px` : undefined}
	style:top={clampedTop !== undefined ? `${clampedTop}px` : undefined}
	{role}
	aria-label={ariaLabel ?? title ?? "Popup"}
>
	<div class="popup-header">
		{#if header}
			{@render header()}
		{:else}
			<div class="popup-title">
				{#if icon}
					{@render icon()}
				{/if}
				{#if title}
					<span>{title}</span>
				{/if}
			</div>
		{/if}
		{#if onClose}
			<button
				class="popup-close"
				tabindex="-1"
				onclick={onClose}
				aria-label="Close"
				title="Close"
			>
				<Close size="14px" />
			</button>
		{/if}
	</div>

	{#if children}
		<div class="popup-body">
			{@render children()}
		</div>
	{/if}
</div>

<style>
	.kitlens-popup {
		position: fixed;
		z-index: 2147483647;

		background: #ffffff;
		border: 1px solid rgba(21, 21, 21, 0.08);
		border-radius: 12px;
		box-shadow:
			0 10px 25px -5px rgba(0, 0, 0, 0.1),
			0 4px 6px -2px rgba(0, 0, 0, 0.05);

		color: rgba(21, 21, 21, 1);
		font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
			monospace;
		font-size: 12px;
		user-select: none;
		box-sizing: border-box;
		max-width: calc(100vw - 16px);
		overflow: hidden;
		display: flex;
		flex-direction: column;
		animation: popIn 0.15s cubic-bezier(0.16, 1, 0.3, 1);
	}

	@keyframes popIn {
		from {
			opacity: 0;
			transform: translateY(4px) scale(0.98);
		}
		to {
			opacity: 1;
			transform: translateY(0) scale(1);
		}
	}

	.popup-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		padding: 8px 10px;
		border-bottom: 1px solid rgba(21, 21, 21, 0.06);
		background: rgba(21, 21, 21, 0.02);
	}

	.popup-title {
		display: flex;
		align-items: center;
		gap: 6px;
		font-weight: 600;
		font-size: 12px;
		color: rgba(21, 21, 21, 0.85);
	}

	.popup-close {
		background: transparent;
		color: rgba(21, 21, 21, 0.6);
		border: none;
		outline: none;
		border-radius: 4px;
		padding: 2px;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition:
			color 0.15s ease,
			background-color 0.15s ease;
	}

	.popup-close:hover {
		color: rgba(21, 21, 21, 1);
		background-color: rgba(21, 21, 21, 0.06);
	}

	.popup-body {
		padding: 10px;
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.popup-body:empty {
		display: none;
	}
</style>
