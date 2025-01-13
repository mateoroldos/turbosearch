<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Tabs from '$lib/components/ui/tabs';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Badge } from '$lib/components/ui/badge';
	import { Plus, Check, Search, X } from 'lucide-svelte';
	import type { Engine, Category, GeneralShortcuts } from '$lib/types';
	import { categories, engines, generalShortcuts, usedShortcuts } from '$lib/stores';
	import { GROUPED_INTEGRATIONS, AVAILABLE_INTEGRATIONS } from '$lib/data/integrations';
	import { toast } from 'svelte-sonner';

	// Dialog states
	let showAddEngineDialog = false;
	let addEngineTab = 'available';
	let integrationFilter = '';
	let showCategoryDialog = false;
	let selectedEngine: Engine | null = null;
	let engineFilter = '';

	$: filteredEngines = $engines.filter(
		(engine) =>
			!engineFilter ||
			engine.name.toLowerCase().includes(engineFilter.toLowerCase()) ||
			engine.url.toLowerCase().includes(engineFilter.toLowerCase())
	);

	$: categoriesWithActive = $categories.map((category) => ({
		...category,
		isActive: selectedEngine?.categories.includes(category.id) ?? false
	}));

	function showCategorySelector(engine: Engine) {
		selectedEngine = engine;
		showCategoryDialog = true;
	}

	// New item states
	let newEngine: Partial<Engine> = { categories: [] };

	function isValidShortcut(key: string): boolean {
		return /^[a-zA-Z0-9]$/.test(key);
	}

	function updateEngineShortcut(engine: Engine, shortcut: string) {
		// Normalize shortcut
		shortcut = shortcut.toLowerCase().trim();

		// Remove shortcut if empty
		if (!shortcut) {
			engines.update((items) =>
				items.map((item) => (item.id === engine.id ? { ...item, shortcut: undefined } : item))
			);
			return;
		}

		// Validate shortcut
		if (!isValidShortcut(shortcut)) {
			toast.error('Shortcut must be a single letter or number');
			return;
		}

		// Check if shortcut is already in use
		if (!isShortcutValid(shortcut, engine.id)) {
			const owner = getShortcutOwner(shortcut);
			toast.error(`Shortcut ${shortcut} is already used by ${owner?.name || 'another item'}`);
			return;
		}

		// Update shortcut
		engines.update((items) =>
			items.map((item) => (item.id === engine.id ? { ...item, shortcut } : item))
		);

		// Show success message
		toast.success(`Updated shortcut for ${engine.name}`);
	}

	function setAddEngineTab(value: string) {
		addEngineTab = value;
	}

	// Integration filtering
	function filteredIntegrations(integrations: typeof AVAILABLE_INTEGRATIONS) {
		if (!integrationFilter) return integrations;

		const searchTerm = integrationFilter.toLowerCase();
		return integrations.filter(
			(integration) =>
				integration.name.toLowerCase().includes(searchTerm) ||
				integration.id.toLowerCase().includes(searchTerm) ||
				integration.categories.some((cat) => cat.toLowerCase().includes(searchTerm))
		);
	}

	// Integration management
	function addIntegration(integration: (typeof AVAILABLE_INTEGRATIONS)[number]) {
		if ($engines.some((e) => e.id === integration.id)) {
			toast.error('This integration is already added');
			return;
		}

		engines.update((items) => [
			...items,
			{
				...integration,
				categories: [...integration.categories]
			}
		]);

		toast.success(`Added ${integration.name} successfully!`);
	}

	function addCustomEngine(event: SubmitEvent) {
		event.preventDefault();

		if (!newEngine.id || !newEngine.name || !newEngine.url) {
			toast.error('Please fill all required fields');
			return;
		}

		if (newEngine.shortcut && !isShortcutValid(newEngine.shortcut)) {
			toast.error(`Shortcut ${newEngine.shortcut} is already in use`);
			return;
		}

		engines.update((items) => [
			...items,
			{
				...newEngine,
				categories: newEngine.categories || []
			} as Engine
		]);

		toast.success(`Added ${newEngine.name} successfully!`);
		newEngine = { categories: [] };
		showAddEngineDialog = false;
	}

	// Validation
	function isShortcutValid(shortcut: string, currentId?: string): boolean {
		if (!shortcut) return true;
		return !$usedShortcuts.has(shortcut) || getShortcutOwner(shortcut)?.id === currentId;
	}

	function getShortcutOwner(shortcut: string) {
		return [...$engines, ...$categories].find((item) => item.shortcut === shortcut);
	}

	function removeEngine(id: string) {
		const confirmed = window.confirm('Are you sure you want to remove this engine?');
		if (confirmed) {
			engines.update((items) => items.filter((engine) => engine.id !== id));
			toast.success('Engine removed successfully');
		}
	}

	function toggleEngineCategory(event: MouseEvent, engine: Engine | null, categoryId: string) {
		event.stopPropagation();
		if (!engine) return;

		engines.update((items) =>
			items.map((item) =>
				item.id === engine.id
					? {
							...item,
							categories: item.categories.includes(categoryId)
								? item.categories.filter((id) => id !== categoryId)
								: [...item.categories, categoryId]
						}
					: item
			)
		);
	}

	function updateCategoryShortcut(category: Category, shortcut: string) {
		if (!isShortcutValid(shortcut, category.id)) {
			toast.error(`Shortcut ${shortcut} is already in use`);
			return;
		}

		categories.update((items) =>
			items.map((item) => (item.id === category.id ? { ...item, shortcut } : item))
		);
	}

	function updateGeneralShortcut(key: keyof GeneralShortcuts, shortcut: string) {
		if (!isShortcutValid(shortcut, key)) {
			toast.error(`Shortcut ${shortcut} is already in use`);
			return;
		}

		generalShortcuts.update((current) => ({
			...current,
			[key]: shortcut
		}));
	}
</script>

<main class="container mx-auto mt-6 max-w-4xl space-y-8 p-4">
	<div class="relative space-y-2">
		<div class="flex items-start justify-between">
			<div>
				<h1 class="text-4xl font-bold tracking-tight">Search Settings</h1>
				<p class="text-sm text-gray-500">Configure your search engines and shortcuts</p>
			</div>
			<Button
				onclick={(event) => {
					event.preventDefault();
					showAddEngineDialog = true;
				}}
			>
				<span class="flex items-center gap-2"> Add Engine </span>
			</Button>
		</div>
	</div>

	<!-- Search Engines List -->
	<Card.Root>
		<Card.Header>
			<div class="flex items-center justify-between">
				<div class="space-y-1">
					<Card.Title class="text-2xl">Search Engines</Card.Title>
					<Card.Description>Manage your search engines and their categories</Card.Description>
				</div>
				<div class="relative w-64">
					<Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
					<Input
						type="text"
						placeholder="Filter engines..."
						bind:value={engineFilter}
						class="pl-9"
					/>
				</div>
			</div>
		</Card.Header>
		<Card.Content class="space-y-4">
			{#each filteredEngines as engine}
				<div
					class="bg-card group relative rounded-lg border p-4 transition-all hover:border-blue-500/50
                           hover:shadow-md dark:hover:border-blue-500/20"
				>
					<!-- Engine content -->
					<div class="flex items-start justify-between">
						<div class="space-y-1">
							<div class="flex items-center gap-3">
								<h3 class="font-medium">{engine.name}</h3>
								<div class="relative">
									<input
										type="text"
										value={engine.shortcut || ''}
										class="border-input h-6 w-8 rounded border bg-transparent px-2 font-mono text-sm
                                               transition-colors hover:border-blue-500/50 focus:border-blue-500
                                               focus:outline-none focus:ring-1 focus:ring-blue-500
                                               {!isShortcutValid(engine.shortcut || '', engine.id)
											? 'border-red-500 focus:border-red-500 focus:ring-red-500'
											: ''}"
										onchange={(e) => updateEngineShortcut(engine, e.currentTarget.value)}
										onfocus={(e) => e.currentTarget.select()}
										maxlength={1}
									/>
								</div>
							</div>
							<p class="text-muted-foreground text-sm">{engine.url}</p>
						</div>

						<!-- Action buttons -->
						<div
							class="flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100"
						>
							<Button
								variant="ghost"
								size="sm"
								onclick={() => showCategorySelector(engine)}
								class="hover:text-primary rounded-full hover:bg-blue-50"
							>
								<Plus class="h-4 w-4" />
							</Button>
							<Button
								variant="ghost"
								size="sm"
								onclick={() => removeEngine(engine.id)}
								class="rounded-full hover:bg-red-50 hover:text-red-500"
							>
								<X class="h-4 w-4" />
							</Button>
						</div>
					</div>

					<!-- Categories -->
					{#if engine.categories.length > 0}
						<div class="mt-3 flex flex-wrap gap-2">
							{#each engine.categories as categoryId}
								{@const category = $categories.find((c) => c.id === categoryId)}
								{#if category}
									<Badge
										variant="secondary"
										class="group/badge flex items-center gap-1
                                               bg-blue-50 text-blue-700 dark:bg-blue-500/10"
									>
										{category.name}
										<button
											class="ml-1 rounded-full p-0.5 opacity-0 transition-opacity
                                                   hover:bg-blue-100 group-hover/badge:opacity-100"
											onclick={(event) => toggleEngineCategory(event, engine, category.id)}
										>
											<X class="h-3 w-3" />
										</button>
									</Badge>
								{/if}
							{/each}
						</div>
					{/if}
				</div>
			{/each}
		</Card.Content>
	</Card.Root>

	<!-- Keyboard Shortcuts -->
	<Card.Root>
		<Card.Header>
			<Card.Title>Keyboard Shortcuts</Card.Title>
		</Card.Header>
		<Card.Content>
			<div class="grid gap-4 sm:grid-cols-2">
				<!-- General -->
				<div>
					<h3 class="mb-2 font-medium">General</h3>
					<div class="space-y-2">
						<div class="flex items-center justify-between">
							<span class="text-sm">Focus Search</span>
							<Input
								type="text"
								value={$generalShortcuts.focusSearch}
								class="w-20 text-center"
								onchange={(event) =>
									updateGeneralShortcut('focusSearch', event.currentTarget.value)}
							/>
						</div>
						<div class="flex items-center justify-between">
							<span class="text-sm">Exit Search</span>
							<Input
								type="text"
								value={$generalShortcuts.exitSearch}
								class="w-20 text-center"
								on:change={(e) => updateGeneralShortcut('exitSearch', e.currentTarget.value)}
							/>
						</div>
					</div>
				</div>

				<!-- Categories -->
				<div>
					<h3 class="mb-2 font-medium">Categories</h3>
					<div class="space-y-2">
						{#each $categories as category}
							<div class="flex items-center justify-between">
								<span class="text-sm">{category.name}</span>
								<Input
									type="text"
									value={category.shortcut}
									class="w-20 text-center"
									on:change={(e) => updateCategoryShortcut(category, e.currentTarget.value)}
								/>
							</div>
						{/each}
					</div>
				</div>
			</div>
		</Card.Content>
	</Card.Root>
</main>

<Dialog.Root bind:open={showAddEngineDialog}>
	<Dialog.Content class="max-w-2xl">
		<Dialog.Header>
			<Dialog.Title>Add Search Engine</Dialog.Title>
			<Dialog.Description>
				Choose from available integrations or add a custom one
			</Dialog.Description>
		</Dialog.Header>

		<Tabs.Root value={addEngineTab} onValueChange={setAddEngineTab}>
			<Tabs.List>
				<Tabs.Trigger value="available">Available Integrations</Tabs.Trigger>
				<Tabs.Trigger value="custom">Custom Engine</Tabs.Trigger>
			</Tabs.List>

			<Tabs.Content value="available" class="space-y-4">
				<Input type="text" placeholder="Filter integrations..." bind:value={integrationFilter} />

				<div class="grid max-h-[60vh] gap-4 overflow-y-auto">
					{#each Object.entries(GROUPED_INTEGRATIONS) as [category, integrations]}
						{#if filteredIntegrations(integrations).length > 0}
							<div>
								<h4 class="mb-2 text-sm font-medium capitalize">{category}</h4>
								<div class="grid gap-2">
									{#each filteredIntegrations(integrations) as integration}
										<button
											class="flex items-center justify-between rounded-lg border p-3 text-left hover:bg-gray-50"
											onclick={() => addIntegration(integration)}
											disabled={$engines.some((e) => e.id === integration.id)}
										>
											<div>
												<span class="font-medium">{integration.name}</span>
												<span class="text-sm text-gray-500">
													({integration.categories.join(', ')})
												</span>
											</div>
											{#if $engines.some((e) => e.id === integration.id)}
												<Badge>Added</Badge>
											{:else}
												<Plus class="h-4 w-4" />
											{/if}
										</button>
									{/each}
								</div>
							</div>
						{/if}
					{/each}
				</div>
			</Tabs.Content>

			<Tabs.Content value="custom">
				<form onsubmit={addCustomEngine} class="space-y-4">
					<div class="grid gap-4">
						<div>
							<Label>ID</Label>
							<Input type="text" bind:value={newEngine.id} placeholder="e.g., 'custom-search'" />
						</div>
						<div>
							<Label>Name</Label>
							<Input
								type="text"
								bind:value={newEngine.name}
								placeholder="e.g., 'My Custom Search'"
							/>
						</div>
						<div>
							<Label>URL</Label>
							<Input
								type="text"
								bind:value={newEngine.url}
								placeholder="https://example.com/search?q=%QUERY%"
							/>
							<p class="mt-1 text-xs text-gray-500">
								Use %QUERY% as a placeholder for the search term
							</p>
						</div>
						<div>
							<Label>Shortcut (optional)</Label>
							<Input
								type="text"
								bind:value={newEngine.shortcut}
								placeholder="Single key shortcut"
								maxlength={1}
							/>
						</div>
						<div>
							<Label>Categories</Label>
							<div class="mt-2 flex flex-wrap gap-2">
								{#each $categories as category}
									<Badge
										variant={newEngine.categories?.includes(category.id) ? 'default' : 'outline'}
										class="cursor-pointer"
										onclick={(event) => {
											event.preventDefault();
											newEngine.categories = newEngine.categories?.includes(category.id)
												? newEngine.categories?.filter((id) => id !== category.id)
												: [...(newEngine.categories || []), category.id];
										}}
									>
										{category.name}
									</Badge>
								{/each}
							</div>
						</div>
					</div>
					<div class="mt-4 flex justify-end gap-2">
						<Button variant="outline" type="button" onclick={() => (showAddEngineDialog = false)}>
							Cancel
						</Button>
						<Button type="submit">Add Engine</Button>
					</div>
				</form>
			</Tabs.Content>
		</Tabs.Root>
	</Dialog.Content>
</Dialog.Root>

<Dialog.Root bind:open={showCategoryDialog}>
	<Dialog.Content class="max-w-md">
		<Dialog.Header>
			<Dialog.Title>Add Categories</Dialog.Title>
			<Dialog.Description>
				Select categories for {selectedEngine?.name}
			</Dialog.Description>
		</Dialog.Header>

		<div class="space-y-4">
			<div class="grid gap-2">
				{#each categoriesWithActive as category}
					<button
						class="flex items-center justify-between rounded-lg border p-3 text-left
							transition-colors hover:bg-gray-50
							{category.isActive ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}"
						onclick={(event) => toggleEngineCategory(event, selectedEngine, category.id)}
					>
						<div>
							<span class="font-medium">{category.name}</span>
							<span class="ml-2 text-sm text-gray-500">
								({category.shortcut})
							</span>
						</div>
						{#if category.isActive}
							<Check class="text-primary h-4 w-4" />
						{:else}
							<Plus class="h-4 w-4 text-gray-400" />
						{/if}
					</button>
				{/each}
			</div>
		</div>

		<div class="mt-4 flex justify-end">
			<Button variant="outline" onclick={() => (showCategoryDialog = false)}>Done</Button>
		</div>
	</Dialog.Content>
</Dialog.Root>

<style>
	/* Add smooth transitions */
	.transition-all {
		transition: all 0.2s ease-in-out;
	}

	/* Enhance hover effects */
	.hover\:shadow-md:hover {
		box-shadow:
			0 4px 6px -1px rgb(0 0 0 / 0.1),
			0 2px 4px -2px rgb(0 0 0 / 0.1);
	}

	/* Add subtle animation to icons */
	.group:hover svg {
		transform: scale(1.1);
		transition: transform 0.2s ease-in-out;
	}
</style>
