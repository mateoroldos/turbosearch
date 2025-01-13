<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Tabs from '$lib/components/ui/tabs';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Badge } from '$lib/components/ui/badge';
	import { Plus, Check, Search, X } from 'lucide-svelte';
	import type { Engine } from '$lib/types';
	import { categories, engines } from '$lib/stores';
	import { GROUPED_INTEGRATIONS, AVAILABLE_INTEGRATIONS } from '$lib/data/integrations';
	import { toast } from 'svelte-sonner';

	let showAddEngineDialog = false;
	let addEngineTab = 'available';
	let integrationFilter = '';
	let showGroupDialog = false;
	let selectedEngine: Engine | null = null;
	let engineFilter = '';
	let isSubmitting = false;
	let showNewGroupInput = false;
	let newGroupName = '';

	$: filteredEngines = $engines.filter(
		(engine) =>
			!engineFilter ||
			engine.name.toLowerCase().includes(engineFilter.toLowerCase()) ||
			engine.url.toLowerCase().includes(engineFilter.toLowerCase())
	);

	$: categoriesWithActive = $categories.map((group) => ({
		...group,
		isActive: selectedEngine?.categories.includes(group.id) ?? false
	}));

	function showGroupSelector(engine: Engine) {
		selectedEngine = engine;
		showGroupDialog = true;
	}

	function createGroupIfNotExists(groupName: string) {
		const existingGroup = $categories.find((c) => c.name.toLowerCase() === groupName.toLowerCase());
		if (!existingGroup) {
			const newGroup = {
				id: groupName.toLowerCase().replace(/\s+/g, '-'),
				name: groupName
			};
			categories.update((cats) => [...cats, newGroup]);
			return newGroup.id;
		}
		return existingGroup.id;
	}

	// New item states
	let newEngine: Partial<Engine> = { categories: [] };

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
	async function addIntegration(integration: (typeof AVAILABLE_INTEGRATIONS)[number]) {
		if ($engines.some((e) => e.id === integration.id)) {
			toast.error('This integration is already added');
			return;
		}

		isSubmitting = true;

		try {
			// Create categories if they don't exist
			const validatedCategories = integration.categories.map(createGroupIfNotExists);

			engines.update((items) => [
				...items,
				{
					...integration,
					categories: validatedCategories
				}
			]);

			toast.success(`Added ${integration.name} successfully!`);
		} catch (error) {
			toast.error('Failed to add integration');
		} finally {
			isSubmitting = false;
		}
	}

	async function addCustomEngine(event: SubmitEvent) {
		event.preventDefault();
		if (!newEngine.id || !newEngine.name || !newEngine.url) {
			toast.error('Please fill all required fields');
			return;
		}

		isSubmitting = true;

		try {
			engines.update((items) => [
				...items,
				{
					...newEngine,
					categories: newEngine.categories || []
				} as Engine
			]);

			toast.success(`Added ${newEngine.name} successfully!`);
			newEngine = { categories: [] };
		} catch (error) {
			toast.error('Failed to add engine');
		} finally {
			isSubmitting = false;
		}
	}

	function removeEngine(id: string) {
		const confirmed = window.confirm('Are you sure you want to remove this engine?');
		if (confirmed) {
			engines.update((items) => items.filter((engine) => engine.id !== id));
			toast.success('Engine removed successfully');
		}
	}

	function toggleEngineGroup(event: MouseEvent, engine: Engine | null, groupId: string) {
		event.stopPropagation();
		if (!engine) return;

		engines.update((items) =>
			items.map((item) =>
				item.id === engine.id
					? {
							...item,
							categories: item.categories.includes(groupId)
								? item.categories.filter((id) => id !== groupId)
								: [...item.categories, groupId]
						}
					: item
			)
		);
	}

	function addNewGroup(event: SubmitEvent) {
		event.preventDefault();
		if (!newGroupName.trim()) {
			toast.error('Group name cannot be empty');
			return;
		}

		const id = newGroupName.toLowerCase().replace(/\s+/g, '-');

		// Check if group already exists
		if (
			$categories.some((c) => c.id === id || c.name.toLowerCase() === newGroupName.toLowerCase())
		) {
			toast.error('Group already exists');
			return;
		}

		categories.update((cats) => [...cats, { id, name: newGroupName }]);
		toast.success('Group added successfully');
		newGroupName = '';
		showNewGroupInput = false;
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
	<Card.Root class="border-2">
		<Card.Header>
			<div class="flex items-center justify-between">
				<div class="space-y-1">
					<Card.Title class="text-2xl font-bold">Search Engines</Card.Title>
					<Card.Description>Manage your search engines and their categories</Card.Description>
				</div>
				<div class="relative w-64">
					<Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
					<Input
						type="text"
						placeholder="Filter engines..."
						bind:value={engineFilter}
						class="pl-9 transition-all focus:ring-2 focus:ring-primary"
					/>
				</div>
			</div>
		</Card.Header>
		<Card.Content class="space-y-4">
			{#if filteredEngines.length === 0}
				<div class="flex flex-col items-center justify-center py-12 text-center">
					<div class="rounded-full bg-gray-100 p-4">
						<Search class="h-8 w-8 text-gray-400" />
					</div>
					<h3 class="mt-4 text-lg font-medium">No engines found</h3>
					<p class="text-sm text-gray-500">Try adjusting your search or add a new engine</p>
				</div>
			{:else}
				{#each filteredEngines as engine}
					<div
						class="group relative rounded-lg border-2 bg-card p-4 transition-all
                    hover:border-primary hover:shadow-lg dark:hover:border-primary/50"
					>
						<!-- Engine content -->
						<div class="flex items-start justify-between">
							<div class="space-y-1">
								<div class="flex items-center gap-3">
									<h3 class="font-medium">{engine.name}</h3>
								</div>
								<p class="text-sm text-muted-foreground">{engine.url}</p>
							</div>

							<!-- Action buttons -->
							<div
								class="flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100"
							>
								<Button
									variant="ghost"
									size="sm"
									onclick={() => showGroupSelector(engine)}
									class="rounded-full text-xs hover:bg-blue-50 hover:text-primary"
								>
									<Plus class="mr-1 size-3" />
									Add Gruop
								</Button>
								<Button
									variant="ghost"
									size="sm"
									onclick={() => removeEngine(engine.id)}
									class="rounded-full hover:bg-red-50 hover:text-red-500"
								>
									<X class="size-3" />
								</Button>
							</div>
						</div>

						<!-- Categories -->
						{#if engine.categories.length > 0}
							<div class="mt-3 flex flex-wrap gap-2">
								{#each engine.categories as groupId}
									{@const group = $categories.find((c) => c.id === groupId)}
									{#if group}
										<Badge
											variant="secondary"
											class="group/badge flex items-center gap-1
                                               bg-blue-50 text-blue-700 dark:bg-blue-500/10"
										>
											{group.name}
											<button
												class="ml-1 rounded-full p-0.5 opacity-0 transition-opacity
                                                   hover:bg-blue-100 group-hover/badge:opacity-100"
												onclick={(event) => toggleEngineGroup(event, engine, group.id)}
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
			{/if}
		</Card.Content>
	</Card.Root>
</main>

<Dialog.Root bind:open={showAddEngineDialog}>
	<Dialog.Content class="max-w-2xl">
		<Dialog.Header>
			<Dialog.Title class="text-2xl font-bold">Add Search Engine</Dialog.Title>
			<Dialog.Description class="text-muted-foreground">
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
					{#each Object.entries(GROUPED_INTEGRATIONS) as [group, integrations]}
						{#if filteredIntegrations(integrations).length > 0}
							<div>
								<h4 class="mb-2 text-sm font-medium capitalize">{group}</h4>
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
							<Label>Categories</Label>
							<div class="mt-2 flex flex-wrap gap-2">
								{#each $categories as group}
									<Badge
										variant={newEngine.categories?.includes(group.id) ? 'default' : 'outline'}
										class="cursor-pointer"
										onclick={(event) => {
											event.preventDefault();
											newEngine.categories = newEngine.categories?.includes(group.id)
												? newEngine.categories?.filter((id) => id !== group.id)
												: [...(newEngine.categories || []), group.id];
										}}
									>
										{group.name}
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

<Dialog.Root bind:open={showGroupDialog}>
	<Dialog.Content class="max-w-md">
		<Dialog.Header>
			<Dialog.Title>Add Groups</Dialog.Title>
			<Dialog.Description>
				Select groups for {selectedEngine?.name}
			</Dialog.Description>
		</Dialog.Header>

		<div class="space-y-4">
			<!-- Add New Group Button/Form -->
			{#if !showNewGroupInput}
				<Button
					variant="outline"
					class="w-full justify-start"
					onclick={() => (showNewGroupInput = true)}
				>
					<Plus class="mr-2 h-4 w-4" />
					Add New Group
				</Button>
			{:else}
				<form class="flex gap-2" onsubmit={addNewGroup}>
					<Input type="text" placeholder="Group name" bind:value={newGroupName} autofocus />
					<Button type="submit">Add</Button>
					<Button
						variant="outline"
						type="button"
						onclick={() => {
							showNewGroupInput = false;
							newGroupName = '';
						}}
					>
						Cancel
					</Button>
				</form>
			{/if}

			<!-- Existing Categories List -->
			<div class="grid max-h-[40vh] gap-2 overflow-y-auto">
				{#each categoriesWithActive as group}
					<button
						class="flex items-center justify-between rounded-lg border p-3 text-left
                        transition-colors hover:bg-gray-50
                        {group.isActive ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}"
						onclick={(event) => toggleEngineGroup(event, selectedEngine, group.id)}
					>
						<div>
							<span class="font-medium">{group.name}</span>
						</div>
						{#if group.isActive}
							<Check class="h-4 w-4 text-primary" />
						{:else}
							<Plus class="h-4 w-4 text-gray-400" />
						{/if}
					</button>
				{/each}
			</div>
		</div>

		<div class="mt-4 flex justify-end">
			<Button
				variant="outline"
				onclick={() => {
					showGroupDialog = false;
					showNewGroupInput = false;
					newGroupName = '';
				}}
			>
				Done
			</Button>
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
