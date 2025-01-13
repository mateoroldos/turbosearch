<script lang="ts">
	import { Button } from '$lib/components/ui/button';

	export let engine: { id: string; name: string; icon?: string };
	export let isActive: boolean;
	export let onToggle: () => void;
</script>

<Button
	variant="outline"
	size="sm"
	on:click={onToggle}
	class="h-7 rounded-full border px-3 text-xs transition-all
    {isActive ? 'shadow-md ring-2 ring-blue-500 ring-offset-2 hover:shadow-lg' : ''}"
>
	{#if engine.icon}
		<img src={engine.icon} alt="" class="mr-2 h-4 w-4" />
	{/if}
	{engine.name}
</Button>
