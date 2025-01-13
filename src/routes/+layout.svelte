<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';
	import { Toaster } from '$lib/components/ui/sonner';
	import { Settings2, X } from 'lucide-svelte';
	import { ModeWatcher } from 'mode-watcher';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';

	const navigationItems = [
		{
			href: '/integrations',
			label: 'Integrations',
			icon: Settings2,
			description: 'Manage your search engines'
		}
	];

	$: currentPath = $page.url.pathname;
</script>

<ModeWatcher />

<div class="fixed left-0 top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
	<div class="container flex h-16 items-center">
		<a class="mr-4" href="/">
			<span
				class="relative mb-3 text-lg font-semibold tracking-tighter text-gray-900 dark:text-white"
			>
				Turbo<span class="text-primary">Search</span>
			</span>
		</a>

		<nav class="flex flex-1 items-center space-x-1">
			{#each navigationItems as item}
				<a
					href={item.href}
					class="group inline-flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors
                           hover:bg-accent hover:text-accent-foreground
                           {currentPath === item.href
						? 'bg-blue-50 text-primary dark:bg-primary/10'
						: 'text-muted-foreground'}"
				>
					<div class="flex items-center gap-2">
						<svelte:component
							this={item.icon}
							class="h-4 w-4 transition-transform group-hover:scale-110"
						/>
						{item.label}
					</div>

					<!-- Tooltip for description -->
					<div
						class="absolute left-1/2 top-14 hidden -translate-x-1/2 rounded-lg bg-popover px-3 py-2
                               text-xs text-popover-foreground opacity-0 shadow-md
                               transition-opacity group-hover:opacity-100 dark:bg-gray-800"
					>
						{item.description}
					</div>
				</a>
			{/each}
		</nav>

		<!-- Right section -->
		<div class="ml-auto flex items-center space-x-4">
			<ThemeToggle />

			<div
				class="hidden h-8 w-px bg-gray-200 dark:bg-gray-800 lg:block"
				role="separator"
				aria-orientation="vertical"
			/>

			<!-- GitHub link -->
			<a
				href="https://github.com/mateoroldos/turbosearch"
				target="_blank"
				rel="noopener noreferrer"
				class="hidden items-center space-x-2 rounded-md bg-gray-900 px-4 py-1.5
                       text-sm font-medium text-white transition-colors
                       hover:bg-gray-700 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 lg:flex"
			>
				<svg class="h-4 w-4" viewBox="0 0 24 24">
					<path
						fill="currentColor"
						d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385c.6.105.825-.255.825-.57c0-.285-.015-1.23-.015-2.235c-3.015.555-3.795-.735-4.035-1.41c-.135-.345-.72-1.41-1.23-1.695c-.42-.225-1.02-.78-.015-.795c.945-.015 1.62.87 1.845 1.23c1.08 1.815 2.805 1.305 3.495.99c.105-.78.42-1.305.765-1.605c-2.67-.3-5.46-1.335-5.46-5.925c0-1.305.465-2.385 1.23-3.225c-.12-.3-.54-1.53.12-3.18c0 0 1.005-.315 3.3 1.23c.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23c.66 1.65.24 2.88.12 3.18c.765.84 1.23 1.905 1.23 3.225c0 4.605-2.805 5.625-5.475 5.925c.435.375.81 1.095.81 2.22c0 1.605-.015 2.895-.015 3.3c0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"
					/>
				</svg>
				<span>Star on GitHub</span>
			</a>
		</div>
	</div>
</div>

<div class="h-16" />

<Toaster />
<main class="min-h-[calc(100vh-4rem)]">
	<slot />
</main>

<style>
	:global(body) {
		font-family:
			'Inter',
			system-ui,
			-apple-system,
			sans-serif;
	}

	:global(::-webkit-scrollbar) {
		width: 8px;
		height: 8px;
	}

	:global(::-webkit-scrollbar-track) {
		background: transparent;
	}

	:global(::-webkit-scrollbar-thumb) {
		background: theme(colors.blue.500 / 20%);
		border-radius: 4px;
	}

	:global(::-webkit-scrollbar-thumb:hover) {
		background: theme(colors.blue.500 / 30%);
	}
</style>
