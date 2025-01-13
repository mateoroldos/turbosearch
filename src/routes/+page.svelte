<script lang="ts">
	import SearchBar from '$lib/components/SearchBar.svelte';
	import EnginesGroup from '$lib/components/EnginesGroup.svelte';
	import { engines, categories, generalShortcuts } from '$lib/stores';
	import { onMount } from 'svelte';

	// Local state
	let query = '';
	let searchBarComponent: any;
	let isSearching = false;

	// Parse commands from query
	$: commands = query.match(/([@#][^\s@#]+)/g) || [];

	// Get active engines based on commands
	$: activeEngines = getCommandSelectedEngines(commands);

	function getCommandSelectedEngines(commands: string[]): string[] {
		if (commands.length === 0) return [];

		const selectedEngines = commands
			.filter((cmd) => cmd.startsWith('@'))
			.map((cmd) => cmd.slice(1).toLowerCase().replace(/-/g, ' ')); // Convert hyphens back to spaces

		const selectedCategories = commands
			.filter((cmd) => cmd.startsWith('#'))
			.map((cmd) => cmd.slice(1).toLowerCase().replace(/-/g, ' ')); // Convert hyphens back to spaces

		return $engines
			.filter((engine) => {
				const matchesEngine = selectedEngines.some(
					(name) => engine.name.toLowerCase() === name.toLowerCase()
				);
				const matchesGroup = engine.categories.some((cat) =>
					selectedCategories.some(
						(selected) =>
							$categories.find((c) => c.name.toLowerCase() === selected.toLowerCase())?.id === cat
					)
				);
				return matchesEngine || matchesGroup;
			})
			.map((engine) => engine.id);
	}

	function addEngineCommand(engineName: string) {
		const command = `@${engineName.replace(/\s+/g, '-')}`; // Replace spaces with hyphens
		if (!commands.includes(command)) {
			// Add the command to the beginning of the query
			query = `${command} ${query}`.trim();
		}
	}

	let searchTimeout: NodeJS.Timeout;

	function search() {
		if (!query.trim() || isSearching) return;

		if (searchTimeout) {
			clearTimeout(searchTimeout);
		}

		// Extract commands and search terms, preserving the original spacing in search terms
		const parts = query.split(' ');
		const searchTerms = parts
			.filter((part) => !part.startsWith('@') && !part.startsWith('#'))
			.join(' ')
			.trim();

		if (!searchTerms || activeEngines.length === 0) {
			return;
		}

		if (isSearching) return;
		isSearching = true;

		const searchEngines = $engines.filter((engine) => activeEngines.includes(engine.id));

		searchTimeout = setTimeout(() => {
			searchEngines.forEach((engine) => {
				const searchUrl = engine.url.replace('%QUERY%', encodeURIComponent(searchTerms));
				window.open(searchUrl, '_blank');
			});

			isSearching = false;
			searchTimeout = undefined;
		}, 100);
	}

	// Keyboard handling
	function handleKeydown(event: KeyboardEvent) {
		const isInputField =
			event.target instanceof HTMLInputElement ||
			event.target instanceof HTMLTextAreaElement ||
			(event.target instanceof HTMLElement && event.target.isContentEditable);

		if (isInputField) {
			if (event.key === 'Enter' && !event.shiftKey) {
				event.preventDefault();
				search();
			} else if (event.key === 'Escape') {
				event.preventDefault();
				handleSearchEscape();
			}
			return;
		}

		// Focus search
		if (event.key === $generalShortcuts.focusSearch) {
			event.preventDefault();
			searchBarComponent?.focus();
		}
	}

	function handleSearchEscape() {
		searchBarComponent?.blur();
	}

	onMount(() => {
		searchBarComponent?.focus();
	});
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="relative min-h-screen bg-[#FAFAFA] dark:bg-gray-950">
	<!-- Grid pattern background -->
	<div class="pointer-events-none absolute inset-0 overflow-hidden">
		<div class="bg-grid-pattern absolute inset-0 opacity-[0.03] dark:opacity-[0.07]" />
		<div class="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/5 to-transparent" />
	</div>

	<main class="container relative mx-auto max-w-3xl px-4 py-16">
		<!-- Header -->
		<div class="mb-16 text-center">
			<div class="relative inline-block">
				<div class="absolute inset-0 animate-pulse blur-3xl">
					<div class="h-full w-full rounded-full bg-blue-500/20" />
				</div>
				<h1
					class="relative mb-3 text-5xl font-semibold tracking-tighter text-gray-900 dark:text-white"
				>
					Turbo<span class="text-primary">Search</span>
				</h1>
			</div>
			<p class=" text-sm text-gray-500 dark:text-gray-400">Search everywhere. Search faster.</p>
		</div>

		<!-- Search -->
		<div class="relative">
			<div class="absolute inset-0 -z-10 animate-pulse blur-3xl">
				<div class="h-full w-full rounded-3xl bg-blue-500/10" />
			</div>
			<SearchBar
				bind:this={searchBarComponent}
				bind:query
				onSearch={search}
				onEscape={handleSearchEscape}
			/>
		</div>

		<!-- Engine Categories -->
		<div class="relative">
			<div class="flex flex-row flex-wrap gap-4">
				{#each Array.from(new Set($engines.flatMap((e) => e.categories))).sort() as groupId}
					<div class="group relative">
						<EnginesGroup
							group={{
								id: groupId,
								name: groupId.charAt(0).toUpperCase() + groupId.slice(1)
							}}
							engines={$engines.filter((e) => e.categories.includes(groupId))}
							{activeEngines}
							onToggleEngine={(engineId) => {
								const engine = $engines.find((e) => e.id === engineId);
								if (engine) addEngineCommand(engine.name);
							}}
						/>
					</div>
				{/each}

				<!-- Uncategorized engines -->
				{#if $engines.some((e) => e.categories.length === 0)}
					<div class="group relative">
						<EnginesGroup
							group={{ id: 'uncategorized', name: 'Uncategorized' }}
							engines={$engines.filter((e) => e.categories.length === 0)}
							{activeEngines}
							onToggleEngine={(engineId) => {
								const engine = $engines.find((e) => e.id === engineId);
								if (engine) addEngineCommand(engine.name);
							}}
						/>
					</div>
				{/if}
			</div>
		</div>
	</main>
</div>

<style>
	.bg-grid-pattern {
		background-image: radial-gradient(
			circle at center,
			theme(colors.blue.500) 0.5px,
			transparent 0.5px
		);
		background-size: 24px 24px;
		animation: gridFloat 30s linear infinite;
	}

	@keyframes gridFloat {
		0% {
			background-position: 0 0;
		}
		100% {
			background-position: 24px 24px;
		}
	}
</style>
