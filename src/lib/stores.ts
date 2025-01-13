import { derived } from 'svelte/store';
import type { Category, Engine, GeneralShortcuts } from './types';
import { persistentStore } from './utils/persistentStore';

// Default configurations
export const DEFAULT_CATEGORIES: Category[] = [
	{ id: 'general', name: 'General', shortcut: '1' },
	{ id: 'ai', name: 'AI', shortcut: '2' },
	{ id: 'dev', name: 'Development', shortcut: '3' },
	{ id: 'docs', name: 'Documentation', shortcut: '4' },
	{ id: 'community', name: 'Community', shortcut: '5' },
	{ id: 'design', name: 'Design', shortcut: '6' }
];

export const DEFAULT_ENGINES: Engine[] = [
	{
		id: 'google',
		name: 'Google',
		url: 'https://www.google.com/search?q=%QUERY%',
		shortcut: 'g',
		categories: ['general']
	},
	{
		id: 'perplexity',
		name: 'Perplexity',
		url: 'https://www.perplexity.ai/?q=%QUERY%',
		shortcut: 'p',
		categories: ['ai']
	},
	{
		id: 'chatgpt',
		name: 'ChatGPT',
		url: 'https://chat.openai.com/?q=%QUERY%',
		shortcut: 'c',
		categories: ['ai']
	},
	{
		id: 'grepapp',
		name: 'grep.app',
		url: 'https://grep.app/search?q=%QUERY%',
		categories: ['dev']
	}
];

export const DEFAULT_GENERAL_SHORTCUTS: GeneralShortcuts = {
	focusSearch: '/',
	exitSearch: 'Escape'
};

// Persistent stores
export const categories = persistentStore<Category[]>(
	'turbo-search-categories',
	DEFAULT_CATEGORIES
);
export const engines = persistentStore<Engine[]>('turbo-search-engines', DEFAULT_ENGINES);
export const generalShortcuts = persistentStore<GeneralShortcuts>(
	'turbo-search-shortcuts',
	DEFAULT_GENERAL_SHORTCUTS
);
export const activeEngines = persistentStore<string[]>('turbo-search-active-engines', []);

// Derived stores for validation
export const usedShortcuts = derived(
	[categories, engines, generalShortcuts],
	([$categories, $engines, $generalShortcuts]) => {
		const shortcuts = new Set<string>();

		// Add general shortcuts
		shortcuts.add($generalShortcuts.focusSearch);
		shortcuts.add($generalShortcuts.exitSearch);

		// Add category shortcuts
		$categories.forEach((cat) => shortcuts.add(cat.shortcut));

		// Add engine shortcuts
		$engines.forEach((engine) => {
			if (engine.shortcut) shortcuts.add(engine.shortcut);
		});

		return shortcuts;
	}
);

// Helper function to reset to defaults
export function resetToDefaults() {
	categories.set(DEFAULT_CATEGORIES);
	engines.set(DEFAULT_ENGINES);
	generalShortcuts.set(DEFAULT_GENERAL_SHORTCUTS);
	activeEngines.set(DEFAULT_ENGINES.slice(0, 3).map((e) => e.id)); // Default to first 3 engines
}
