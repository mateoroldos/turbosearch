<script lang="ts">
	import type { Group, Engine } from '$lib/types';
	import EngineButton from './EngineButton.svelte';

	export let group: Group;
	export let engines: Engine[];
	export let activeEngines: string[];
	export let onToggleEngine: (id: string) => void;
</script>

<div class="space-y-2 rounded-lg border border-dashed bg-background/40 p-3">
	<h3 class="text-xs uppercase tracking-wider text-gray-500">
		{group.name}
	</h3>
	<div class="flex flex-wrap gap-2">
		{#each engines as engine}
			<EngineButton
				{engine}
				isActive={activeEngines.includes(engine.id)}
				onToggle={() => onToggleEngine(engine.id)}
			/>
		{/each}
	</div>
</div>
