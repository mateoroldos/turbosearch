import { derived } from 'svelte/store';
import type { Group, Engine, GeneralShortcuts } from './types';
import { persistentStore } from './utils/persistentStore';

// Default configurations
export const DEFAULT_CATEGORIES: Group[] = [
	{ id: 'general', name: 'General' },
	{ id: 'ai', name: 'AI' },
	{ id: 'dev', name: 'Development' },
	{ id: 'docs', name: 'Documentation' },
	{ id: 'community', name: 'Community' },
	{ id: 'design', name: 'Design' }
];

export const DEFAULT_ENGINES: Engine[] = [
	{
		id: 'google',
		name: 'Google',
		url: 'https://www.google.com/search?q=%QUERY%',
		categories: ['general']
	},
	{
		id: 'perplexity',
		name: 'Perplexity',
		url: 'https://www.perplexity.ai/?q=%QUERY%',
		categories: ['ai']
	},
	{
		id: 'chatgpt',
		name: 'ChatGPT',
		url: 'https://chat.openai.com/?q=%QUERY%',
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
export const categories = persistentStore<Group[]>('turbo-search-categories', DEFAULT_CATEGORIES);
export const engines = persistentStore<Engine[]>('turbo-search-engines', DEFAULT_ENGINES);
export const generalShortcuts = persistentStore<GeneralShortcuts>(
	'turbo-search-shortcuts',
	DEFAULT_GENERAL_SHORTCUTS
);
export const activeEngines = persistentStore<string[]>('turbo-search-active-engines', []);

// Derived stores for validation
export const usedShortcuts = derived([generalShortcuts], ([$generalShortcuts]) => {
	const shortcuts = new Set<string>();
	shortcuts.add($generalShortcuts.focusSearch);
	shortcuts.add($generalShortcuts.exitSearch);
	return shortcuts;
});

// Helper function to reset to defaults
export function resetToDefaults() {
	categories.set(DEFAULT_CATEGORIES);
	engines.set(DEFAULT_ENGINES);
	generalShortcuts.set(DEFAULT_GENERAL_SHORTCUTS);
	activeEngines.set(DEFAULT_ENGINES.slice(0, 3).map((e) => e.id)); // Default to first 3 engines
}
