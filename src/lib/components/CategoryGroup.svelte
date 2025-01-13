<script lang="ts">
	import type { Category, Engine } from '$lib/types';
	import EngineButton from './EngineButton.svelte';

	export let category: Category;
	export let engines: Engine[];
	export let activeEngines: string[];
	export let onToggleEngine: (id: string) => void;
</script>

<div class="space-y-3">
	<div class="flex items-center gap-2">
		<h3 class="text-xs uppercase tracking-wider text-gray-500">
			{category.name}
		</h3>
	</div>
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
