<script lang="ts">
    import icon from "#lib/ui/icon.svg";
    let open = $state(false);
</script>

{#if open}
    <div class="panel">
        <h4>Kitlens</h4>
        <button onclick={() => (open = false)}>Close</button>
    </div>
{/if}

<button class="fab" onclick={() => (open = !open)}>
    <img src={icon} alt="Kitlens" />
</button>

<style>
    .fab {
        position: fixed;
        bottom: 16px;
        right: 16px;
        z-index: 2147483647;
        border-radius: 100%;
        border: none;
        padding: 8px;
        background: rgb(218, 218, 218);
    }
    .panel {
        position: fixed;
        bottom: 64px;
        right: 16px;
        z-index: 2147483647;
        background: #1e1e2e;
        color: white;
        padding: 16px;
        border-radius: 8px;
    }
</style>
