<script lang="ts">
	import type { Category, Engine } from '$lib/types';
	import KeyboardShortcut from './KeyboardShortcut.svelte';
	import EngineButton from './EngineButton.svelte';

	export let category: Category;
	export let engines: Engine[];
	export let manuallySelectedEngines: string[];
	export let commandSelectedEngines: string[];
	export let selectedEngineIndex: number;
	export let onToggleEngine: (id: string) => void;

	$: activeEngines = [...new Set([...manuallySelectedEngines, ...commandSelectedEngines])];
</script>

<div class="space-y-3">
	<div class="flex items-center gap-2">
		<h3 class=" text-xs uppercase tracking-wider text-gray-500">
			{category.name}
		</h3>
		<KeyboardShortcut keys={category.shortcut} />
	</div>
	<div class="flex flex-wrap gap-2">
		{#each engines as engine}
			<EngineButton
				{engine}
				isManuallySelected={manuallySelectedEngines.includes(engine.id)}
				isCommandSelected={commandSelectedEngines.includes(engine.id)}
				letterShortcut={engine.shortcut?.toUpperCase()}
				categoryNumber={category.shortcut}
				onToggle={() => onToggleEngine(engine.id)}
			/>
		{/each}
	</div>
</div>
