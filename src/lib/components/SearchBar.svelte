<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import KeyboardShortcut from './KeyboardShortcut.svelte';
	import { generalShortcuts } from '$lib/stores';
	import { Search } from 'lucide-svelte';
	import { engines, categories } from '$lib/stores';
	import { fade } from 'svelte/transition';
	import Fuse from 'fuse.js';
	import { AVAILABLE_INTEGRATIONS } from '$lib/data/integrations';

	export let query: string;
	export let onSearch: () => void;
	export let onEscape: () => void;

	type SuggestionSource = 'saved' | 'available';

	type Suggestion = {
		type: 'engine' | 'group';
		id: string;
		name: string;
		shortcut?: string;
		source: SuggestionSource;
	};

	let inputElement: HTMLInputElement;
	let isFocused = false;
	let selectedIndex = -1;

	// Command mode state
	let isEngineCommandMode = false;
	let isGroupCommandMode = false;
	let isCommandMode = false;
	let commandQuery = '';

	const MAX_SUGGESTIONS = 6;
	const FUZZY_OPTIONS = {
		isCaseSensitive: false,
		includeScore: true,
		threshold: 0.3,
		minMatchCharLength: 1,
		keys: ['name']
	};

	// Parse and track commands
	$: commands = query.match(/([@#][^\s@#]+)/g) || [];
	$: selectedEngines = commands.filter((cmd) => cmd.startsWith('@')).map((cmd) => cmd.slice(1));
	$: selectedCategories = commands.filter((cmd) => cmd.startsWith('#')).map((cmd) => cmd.slice(1));

	// Handle command mode and query
	$: {
		const lastSpaceIndex = query.lastIndexOf(' ');
		const currentInput = lastSpaceIndex === -1 ? query : query.slice(lastSpaceIndex + 1);

		isEngineCommandMode = currentInput.startsWith('@');
		isGroupCommandMode = currentInput.startsWith('#');
		isCommandMode = isEngineCommandMode || isGroupCommandMode;

		if (isCommandMode) {
			commandQuery = currentInput.slice(1).toLowerCase();
		} else {
			commandQuery = '';
			selectedIndex = -1;
		}
	}

	function formatCommandName(name: string): string {
		return name.replace(/\s+/g, '-');
	}

	// Generate suggestions based on command mode
	$: suggestions = getFuzzySuggestions(
		commandQuery,
		isEngineCommandMode,
		selectedEngines,
		selectedCategories
	);

	function handleSuggestionSelect(suggestion: Suggestion) {
		const prefix = suggestion.type === 'engine' ? '@' : '#';
		// Format the name with hyphens instead of spaces
		const formattedName = formatCommandName(suggestion.name);
		const newCommand = `${prefix}${formattedName}`;

		const lastSpaceIndex = query.lastIndexOf(' ');
		const beforeCommand = lastSpaceIndex === -1 ? '' : query.slice(0, lastSpaceIndex + 1);

		// Update query with the new command
		query = beforeCommand + newCommand + ' ';

		// Reset selection state
		selectedIndex = -1;
		inputElement?.focus();
	}

	function getFuzzySuggestions(
		query: string,
		isEngine: boolean,
		selectedEngs: string[],
		selectedCats: string[]
	) {
		if (!isCommandMode) return [];

		// Get saved items
		const savedItems = isEngine
			? $engines.filter((eng) => !selectedEngs.includes(formatCommandName(eng.name)))
			: $categories.filter((cat) => !selectedCats.includes(formatCommandName(cat.name)));

		// Get available items (only for engines)
		const availableItems = isEngine
			? AVAILABLE_INTEGRATIONS.filter(
					(integration) =>
						!selectedEngs.includes(formatCommandName(integration.name)) &&
						!$engines.some((eng) => eng.id === integration.id)
				)
			: [];

		if (!query.trim()) {
			return [
				...savedItems
					.slice(0, MAX_SUGGESTIONS)
					.map((item) => mapToSuggestion(isEngine ? 'engine' : 'group', 'saved')(item)),
				...availableItems
					.slice(0, MAX_SUGGESTIONS)
					.map((item) => mapToSuggestion('engine', 'available')(item))
			];
		}

		// Replace hyphens with spaces for matching
		const searchQuery = query.replace(/-/g, ' ');

		// Create Fuse instances for both saved and available items
		const savedFuse = new Fuse(savedItems, {
			...FUZZY_OPTIONS,
			getFn: (obj, path) => {
				const value = obj[path as keyof typeof obj];
				return typeof value === 'string' ? value.replace(/-/g, ' ') : value;
			}
		});

		const availableFuse = new Fuse(availableItems, {
			...FUZZY_OPTIONS,
			getFn: (obj, path) => {
				const value = obj[path as keyof typeof obj];
				return typeof value === 'string' ? value.replace(/-/g, ' ') : value;
			}
		});

		// Get results from both sources
		const savedResults = savedFuse
			.search(searchQuery)
			.map(({ item }) => mapToSuggestion(isEngine ? 'engine' : 'group', 'saved')(item));

		const availableResults = availableFuse
			.search(searchQuery)
			.map(({ item }) => mapToSuggestion('engine', 'available')(item));

		return [...savedResults, ...availableResults].slice(0, MAX_SUGGESTIONS * 2);
	}

	function mapToSuggestion(type: 'engine' | 'group', source: SuggestionSource = 'saved') {
		return (item: any): Suggestion => ({
			type,
			id: item.id,
			name: item.name,
			shortcut: item.shortcut,
			source
		});
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (isCommandMode && suggestions.length > 0) {
			switch (event.key) {
				case 'ArrowDown':
					event.preventDefault();
					selectedIndex = (selectedIndex + 1) % suggestions.length;
					break;
				case 'ArrowUp':
					event.preventDefault();
					selectedIndex = selectedIndex <= 0 ? suggestions.length - 1 : selectedIndex - 1;
					break;
				case 'Enter':
					if (selectedIndex >= 0) {
						event.preventDefault();
						handleSuggestionSelect(suggestions[selectedIndex]);
					}
					break;
				case 'Tab':
					event.preventDefault();
					handleSuggestionSelect(suggestions[selectedIndex >= 0 ? selectedIndex : 0]);
					break;
				case 'Escape':
					event.preventDefault();
					selectedIndex = -1;
					break;
			}
		} else {
			if (event.key === $generalShortcuts.exitSearch) {
				event.preventDefault();
				inputElement?.blur();
				onEscape?.();
				return;
			}

			if (event.key === 'Enter') {
				event.preventDefault();
				onSearch();
			}
		}
	}

	export function focus() {
		inputElement?.focus();
	}
</script>

<Card.Root class="mb-8">
	<Card.Content class="p-3">
		<div class="relative">
			<!-- Search Input -->
			<div
				class="relative overflow-hidden rounded-lg border backdrop-blur-sm transition-all {isFocused
					? 'border-foreground/60 shadow-lg'
					: 'border-border'}"
			>
				<input
					bind:this={inputElement}
					type="text"
					bind:value={query}
					onfocus={() => (isFocused = true)}
					onblur={() => (isFocused = false)}
					onkeydown={handleKeyDown}
					placeholder={isFocused ? 'Type @ for engines, # for categories...' : 'Search anything...'}
					class="w-full bg-transparent px-4 py-3 focus:outline-none"
				/>
				<div class="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-2">
					<Button
						variant="ghost"
						size="icon"
						onclick={onSearch}
						class="hover:bg-primary/10 hover:text-primary dark:hover:bg-primary/20"
						aria-label="Search"
					>
						<Search class="h-5 w-5" />
					</Button>
				</div>
			</div>

			<!-- Command Mode Suggestions -->
			{#if isCommandMode && isFocused}
				<div
					transition:fade={{ duration: 100 }}
					class="absolute z-20 mt-2 w-full overflow-hidden rounded-lg border bg-background
                 shadow-lg backdrop-blur-sm"
				>
					<!-- Search stats -->
					<div class="border-b border-blue-500/20 px-3 py-1.5 text-xs">
						{#if (isEngineCommandMode && $engines.some((e) => e.name.toLowerCase() === commandQuery.toLowerCase())) || (isGroupCommandMode && $categories.some((c) => c.name.toLowerCase() === commandQuery.toLowerCase()))}
							<span class="text-green-500">✓</span>
							<span class={isEngineCommandMode ? 'text-blue-500' : 'text-purple-500'}>
								{isEngineCommandMode ? '@' : '#'}{commandQuery}
							</span>
							selected
						{:else if suggestions.length > 0}
							{suggestions.length} result{suggestions.length === 1 ? '' : 's'}
							{#if commandQuery}
								for "{commandQuery}"
							{/if}
						{:else if commandQuery}
							No results for "{commandQuery}"
						{:else}
							Start typing to search {isEngineCommandMode ? 'engines' : 'categories'}
						{/if}
					</div>

					<!-- Suggestions list -->
					{#if suggestions.length > 0}
						<div class="max-h-[300px] overflow-y-auto p-1.5">
							{#if suggestions.some((s) => s.source === 'saved')}
								<div class="mb-2">
									<div class="px-2 py-1 text-xs font-medium text-gray-500">Saved</div>
									{#each suggestions.filter((s) => s.source === 'saved') as suggestion, i}
										<button
											class="flex w-full items-center justify-between rounded-md px-3 py-2 text-left
                        text-sm transition-colors
                        {i === selectedIndex ? 'bg-blue-500/20' : 'hover:bg-blue-500/10'}"
											onclick={() => handleSuggestionSelect(suggestion)}
										>
											<div class="flex items-center gap-2">
												<span>{suggestion.type === 'engine' ? '@' : '#'}</span>
												<span class="font-medium">{formatCommandName(suggestion.name)}</span>
											</div>
											{#if (selectedIndex === -1 && i === 0) || selectedIndex === i}
												<kbd class="text-xs text-gray-500">tab</kbd>
											{/if}
										</button>
									{/each}
								</div>
							{/if}

							{#if suggestions.some((s) => s.source === 'available')}
								<div>
									<div class="px-2 py-1 text-xs font-medium text-gray-500">Available</div>
									{#each suggestions.filter((s) => s.source === 'available') as suggestion, i}
										<button
											class="flex w-full items-center justify-between rounded-md px-3 py-2 text-left
                        text-sm opacity-75 transition-colors hover:opacity-100
                        {i + suggestions.filter((s) => s.source === 'saved').length ===
											selectedIndex
												? 'bg-blue-500/20'
												: 'hover:bg-blue-500/10'}"
											onclick={() => handleSuggestionSelect(suggestion)}
										>
											<div class="flex items-center gap-2">
												<span>@</span>
												<span class="font-medium">{formatCommandName(suggestion.name)}</span>
											</div>
											{#if selectedIndex === i + suggestions.filter((s) => s.source === 'saved').length}
												<kbd class="text-xs text-gray-500">tab</kbd>
											{/if}
										</button>
									{/each}
								</div>
							{/if}
						</div>
					{/if}
				</div>
			{/if}

			<!-- Keyboard Shortcuts Help -->
			{#if isFocused}
				<div
					class="mt-3 flex flex-row justify-between rounded-lg border bg-gray-50/50 p-3 backdrop-blur-sm dark:bg-gray-900/50"
				>
					<div class="flex items-center gap-4">
						<div class="flex items-center gap-1">
							<KeyboardShortcut keys="@" />
							<span class="text-xs text-gray-400">engine</span>
						</div>
						<div class="flex items-center gap-1">
							<KeyboardShortcut keys="#" />
							<span class="text-xs text-gray-400">group</span>
						</div>
					</div>
					<div class="flex items-center gap-2">
						<KeyboardShortcut keys="↵" />
						<span class="text-xs text-gray-400">search</span>
					</div>
				</div>
			{:else}
				<div
					class="mt-3 flex items-center justify-center rounded-lg border bg-gray-50/50 p-2 backdrop-blur-sm dark:bg-gray-900/50"
				>
					<KeyboardShortcut keys={$generalShortcuts.focusSearch} />
					<span class="ml-2 text-xs text-gray-400">to start searching</span>
				</div>
			{/if}
		</div>
	</Card.Content>
</Card.Root>
