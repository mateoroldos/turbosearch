<script lang="ts">
	import SearchBar from '$lib/components/SearchBar.svelte';
	import CategoryGroup from '$lib/components/CategoryGroup.svelte';
	import {
		engines,
		categories,
		generalShortcuts,
		activeEngines as activeEnginesStore
	} from '$lib/stores';

	// Local state
	let query = '';
	let searchBarComponent: any;
	let selectedEngineIndex = -1;
	let isSearching = false;

	// Parse commands from query
	$: commands = query.match(/([@#][^\s@#]+)/g) || [];

	// Get engines selected by commands
	$: commandSelectedEngines = getCommandSelectedEngines(commands);

	// Combine manual and command selections
	$: activeEngines = [...new Set([...$activeEnginesStore, ...commandSelectedEngines])];

	function getCommandSelectedEngines(commands: string[]): string[] {
		if (commands.length === 0) return [];

		const selectedEngines = commands
			.filter((cmd) => cmd.startsWith('@'))
			.map((cmd) => cmd.slice(1).toLowerCase());
		const selectedCategories = commands
			.filter((cmd) => cmd.startsWith('#'))
			.map((cmd) => cmd.slice(1).toLowerCase());

		return $engines
			.filter((engine) => {
				const matchesEngine = selectedEngines.some(
					(name) => engine.name.toLowerCase() === name.toLowerCase()
				);
				const matchesCategory = engine.categories.some((cat) =>
					selectedCategories.some(
						(selected) =>
							$categories.find((c) => c.name.toLowerCase() === selected.toLowerCase())?.id === cat
					)
				);
				return matchesEngine || matchesCategory;
			})
			.map((engine) => engine.id);
	}

	function categoryHasVisibleEngines(categoryId: string) {
		return $engines.some((e) => e.categories.includes(categoryId));
	}

	let searchTimeout: NodeJS.Timeout;

	function search() {
		if (!query.trim() || isSearching) return;

		// Clear any pending search
		if (searchTimeout) {
			clearTimeout(searchTimeout);
		}

		// Extract commands and search terms
		const parts = query.split(' ');
		const searchTerms = parts
			.filter((part) => !part.startsWith('@') && !part.startsWith('#'))
			.join(' ')
			.trim();

		// Validate search
		if (!searchTerms) {
			return;
		}

		if (activeEngines.length === 0) {
			return;
		}

		// Prevent multiple searches
		if (isSearching) return;
		isSearching = true;

		// Get unique engines from both selections
		const searchEngines = $engines.filter((engine) => activeEngines.includes(engine.id));

		// Use timeout to prevent double execution
		searchTimeout = setTimeout(() => {
			// Perform searches
			searchEngines.forEach((engine) => {
				const searchUrl = engine.url.replace('%QUERY%', encodeURIComponent(searchTerms));
				window.open(searchUrl, '_blank');
			});

			// Reset state
			isSearching = false;
			searchTimeout = undefined;
		}, 100);
	}

	function toggleEngine(id: string) {
		activeEnginesStore.update((current) =>
			current.includes(id) ? current.filter((e) => e !== id) : [...current, id]
		);
	}

	function toggleCategory(categoryId: string) {
		const categoryEngines = $engines
			.filter((engine) => engine.categories.includes(categoryId))
			.map((engine) => engine.id);

		const allActive = categoryEngines.every((id) => $activeEnginesStore.includes(id));

		activeEnginesStore.update((current) =>
			allActive
				? current.filter((id) => !categoryEngines.includes(id))
				: [...new Set([...current, ...categoryEngines])]
		);
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

		// Category shortcuts
		const category = $categories.find((cat) => cat.shortcut === event.key);
		if (category && !event.ctrlKey && !event.metaKey && !event.altKey) {
			event.preventDefault();
			toggleCategory(category.id);
			return;
		}

		// Engine shortcuts
		const engine = $engines.find((eng) => eng.shortcut === event.key);
		if (engine && !event.ctrlKey && !event.metaKey && !event.altKey) {
			event.preventDefault();
			toggleEngine(engine.id);
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
		<div class="relative space-y-6">
			<div class="space-y-4">
				{#each $categories as category}
					{#if categoryHasVisibleEngines(category.id)}
						<div class="group relative">
							<div
								class="absolute inset-0 -z-10 rounded-xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0
                                      transition-opacity duration-300 group-hover:opacity-100"
							/>
							<CategoryGroup
								{category}
								engines={$engines.filter((e) => e.categories.includes(category.id))}
								manuallySelectedEngines={$activeEnginesStore}
								{commandSelectedEngines}
								{selectedEngineIndex}
								onToggleEngine={toggleEngine}
							/>
						</div>
					{/if}
				{/each}
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
