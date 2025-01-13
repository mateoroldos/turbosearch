<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Tooltip from '$lib/components/ui/tooltip';

	export let engine: { id: string; name: string; icon?: string };
	export let isManuallySelected: boolean;
	export let isCommandSelected: boolean;
	export let letterShortcut: string | undefined;
	export let categoryNumber: string | undefined;
	export let onToggle: () => void;

	$: isActive = isManuallySelected || isCommandSelected;
</script>

<Tooltip.Root>
	<Tooltip.Trigger>
		<Button
			variant={isManuallySelected ? 'default' : 'outline'}
			size="sm"
			on:click={onToggle}
			class="h-7 rounded-full border px-3  text-xs transition-all
                {isActive ? 'shadow-md hover:shadow-lg' : ''}
                {isCommandSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}"
		>
			{#if letterShortcut}
				<span class="mr-1 opacity-50">{letterShortcut}</span>
			{/if}
			{#if engine.icon}
				<img src={engine.icon} alt="" class="mr-2 h-4 w-4" />
			{/if}
			{engine.name}
		</Button>
	</Tooltip.Trigger>
	<Tooltip.Content>
		<div class="text-xs">
			<div>Click to {isManuallySelected ? 'disable' : 'enable'}</div>
			{#if isCommandSelected}
				<div class="text-primary">Selected by command</div>
			{/if}
			<div class="text-gray-400">
				Press {letterShortcut} to toggle directly or {categoryNumber} to toggle category
			</div>
		</div>
	</Tooltip.Content>
</Tooltip.Root>
