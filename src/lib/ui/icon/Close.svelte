<script lang="ts">
	let { color = "currentColor", size = "16px", ...props } = $props();
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	width={size}
	height={size}
	viewBox="0 0 24 24"
	fill="none"
	stroke={color}
	stroke-width="2"
	stroke-linecap="round"
	stroke-linejoin="round"
	class="lucide lucide-x preview-icon"
	{...props}><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg
>
