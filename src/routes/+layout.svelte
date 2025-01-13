<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';
	import { Toaster } from '$lib/components/ui/sonner';
	import { Settings2, Command, Info, X } from 'lucide-svelte';
	import { ModeWatcher } from 'mode-watcher';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import { browser } from '$app/environment';
	import { writable } from 'svelte/store';
	import Button from '$lib/components/ui/button/button.svelte';

	const navigationItems = [
		{
			href: '/integrations',
			label: 'Integrations',
			icon: Settings2,
			description: 'Manage your search engines'
		}
	];

	const hasPromptBeenDismissed = writable(false);

	if (browser) {
		const dismissed = localStorage.getItem('newTabPromptDismissed') === 'true';
		hasPromptBeenDismissed.set(dismissed);
	}

	function dismissPrompt() {
		hasPromptBeenDismissed.set(true);
		if (browser) {
			localStorage.setItem('newTabPromptDismissed', 'true');
		}
	}

	function getBrowserInstructions() {
		if (!browser) return null;

		const userAgent = navigator.userAgent.toLowerCase();

		if (userAgent.includes('chrome')) {
			return {
				browser: 'Chrome',
				steps: [
					'Install the "New Tab Redirect" extension',
					'Set the URL to this page',
					'Open a new tab to see TurboSearch'
				]
			};
		} else if (userAgent.includes('firefox')) {
			return {
				browser: 'Firefox',
				steps: [
					'Install the "New Tab Override" extension',
					'Set the URL to this page',
					'Enjoy TurboSearch in every new tab'
				]
			};
		} else if (userAgent.includes('safari')) {
			return {
				browser: 'Safari',
				steps: [
					'Open Safari Preferences',
					'Go to General tab',
					'Set New tabs open with: to "Homepage"',
					'Set Homepage to this page URL'
				]
			};
		}

		return null;
	}

	function getExtensionUrl(browser: string) {
		switch (browser) {
			case 'Chrome':
				return 'https://chrome.google.com/webstore/detail/new-tab-redirect/icpgjfneehieebagbmdbhnlpiopdcmna';
			case 'Firefox':
				return 'https://addons.mozilla.org/en-US/firefox/addon/new-tab-override/';
			default:
				return '#';
		}
	}

	$: browserInstructions = getBrowserInstructions();

	$: currentPath = $page.url.pathname;
</script>

<ModeWatcher />

<div class="bg-background/80 fixed left-0 top-0 z-50 w-full border-b backdrop-blur-sm">
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
					class="hover:bg-accent hover:text-accent-foreground group inline-flex items-center rounded-md px-3 py-2 text-sm
                           font-medium transition-colors
                           {currentPath === item.href
						? 'text-primary dark:bg-primary/10 bg-blue-50'
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
						class="bg-popover text-popover-foreground absolute left-1/2 top-14 hidden -translate-x-1/2 rounded-lg px-3
                               py-2 text-xs opacity-0 shadow-md
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
				class="hidden h-8 w-px bg-gray-200 lg:block dark:bg-gray-800"
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
                       hover:bg-gray-700 lg:flex dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
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

<!-- Add spacing for fixed header -->
<div class="h-16" />

{#if browser && !$hasPromptBeenDismissed && browserInstructions}
	<div class="animate-slide-up fixed bottom-4 right-4 z-50 w-96">
		<div class="bg-card relative overflow-hidden rounded-lg border p-6 shadow-lg">
			<!-- Close button -->
			<button
				onclick={dismissPrompt}
				class="absolute right-2 top-2 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
			>
				<X class="h-4 w-4" />
			</button>

			<!-- Content -->
			<div class="flex items-start space-x-4">
				<div class="rounded-full bg-blue-100 p-2 text-blue-600">
					<Info class="h-5 w-5" />
				</div>
				<div class="flex-1">
					<h3 class="mb-1 font-medium">Make TurboSearch Your New Tab Page</h3>
					<p class="mb-3 text-sm text-gray-500">
						Get instant access to TurboSearch every time you open a new tab in {browserInstructions.browser}
					</p>

					<!-- Browser-specific instructions -->
					<div class="space-y-2">
						{#each browserInstructions.steps as step, i}
							<div class="flex items-center gap-2 text-sm">
								<span
									class="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-xs text-blue-600"
								>
									{i + 1}
								</span>
								<span>{step}</span>
							</div>
						{/each}
					</div>

					<!-- Action buttons -->
					<div class="mt-4 flex gap-2">
						<Button
							onclick={() => window.open(getExtensionUrl(browserInstructions.browser), '_blank')}
							class="group bg-blue-500 text-white hover:bg-blue-600"
						>
							Get Extension
							<span class="ml-1 inline-block transition-transform group-hover:translate-x-0.5"
								>→</span
							>
						</Button>
						<Button variant="outline" onclick={dismissPrompt}>Maybe Later</Button>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}

<Toaster />
<main class="min-h-[calc(100vh-4rem)]">
	<slot />
</main>

<style>
	@keyframes slide-up {
		from {
			opacity: 0;
			transform: translateY(1rem);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.animate-slide-up {
		animation: slide-up 0.3s ease-out;
	}

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
