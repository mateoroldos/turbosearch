export const AVAILABLE_INTEGRATIONS = [
	// General Search
	{
		id: 'google',
		name: 'Google',
		url: 'https://www.google.com/search?q=%QUERY%',
		shortcut: 'g',
		categories: ['general'],
		icon: 'https://www.google.com/favicon.ico'
	},
	{
		id: 'bing',
		name: 'Bing',
		url: 'https://www.bing.com/search?q=%QUERY%',
		shortcut: 'b',
		categories: ['general']
	},
	{
		id: 'duckduckgo',
		name: 'DuckDuckGo',
		url: 'https://duckduckgo.com/?q=%QUERY%',
		shortcut: 'd',
		categories: ['general']
	},

	// AI Tools
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
		id: 'claude',
		name: 'Claude',
		url: 'https://claude.ai/new?q=message=%QUERY%',
		shortcut: 'l',
		categories: ['ai']
	},
	{
		id: 'bard',
		name: 'Bard',
		url: 'https://bard.google.com/?q=%QUERY%',
		categories: ['ai']
	},

	// Development
	{
		id: 'github',
		name: 'GitHub',
		url: 'https://github.com/search?q=%QUERY%',
		shortcut: 'h',
		categories: ['dev']
	},
	{
		id: 'stackoverflow',
		name: 'Stack Overflow',
		url: 'https://stackoverflow.com/search?q=%QUERY%',
		shortcut: 's',
		categories: ['dev']
	},
	{
		id: 'mdn',
		name: 'MDN Docs',
		url: 'https://developer.mozilla.org/en-US/search?q=%QUERY%',
		shortcut: 'm',
		categories: ['dev', 'docs']
	},
	{
		id: 'devdocs',
		name: 'DevDocs',
		url: 'https://devdocs.io/#q=%QUERY%',
		categories: ['dev', 'docs']
	},

	// Package Managers
	{
		id: 'npm',
		name: 'npm',
		url: 'https://www.npmjs.com/search?q=%QUERY%',
		shortcut: 'n',
		categories: ['dev', 'docs']
	},
	{
		id: 'pypi',
		name: 'PyPI',
		url: 'https://pypi.org/search/?q=%QUERY%',
		categories: ['dev', 'docs']
	},
	{
		id: 'crates',
		name: 'Crates.io',
		url: 'https://crates.io/search?q=%QUERY%',
		categories: ['dev', 'docs']
	},

	// Code Search
	{
		id: 'sourcegraph',
		name: 'Sourcegraph',
		url: 'https://sourcegraph.com/search?q=%QUERY%',
		categories: ['dev']
	},
	{
		id: 'grepapp',
		name: 'grep.app',
		url: 'https://grep.app/search?q=%QUERY%',
		categories: ['dev']
	},

	// Community
	{
		id: 'reddit',
		name: 'Reddit',
		url: 'https://www.reddit.com/search/?q=%QUERY%',
		shortcut: 'r',
		categories: ['community']
	},
	{
		id: 'devto',
		name: 'Dev.to',
		url: 'https://dev.to/search?q=%QUERY%',
		categories: ['community', 'dev']
	},
	{
		id: 'hackernews',
		name: 'Hacker News',
		url: 'https://hn.algolia.com/?q=%QUERY%',
		categories: ['community', 'dev']
	},

	// Design
	{
		id: 'dribbble',
		name: 'Dribbble',
		url: 'https://dribbble.com/search/%QUERY%',
		categories: ['design']
	},
	{
		id: 'behance',
		name: 'Behance',
		url: 'https://www.behance.net/search?search=%QUERY%',
		categories: ['design']
	},

	// Video
	{
		id: 'youtube',
		name: 'YouTube',
		url: 'https://www.youtube.com/results?search_query=%QUERY%',
		shortcut: 'y',
		categories: ['video']
	},
	{
		id: 'vimeo',
		name: 'Vimeo',
		url: 'https://vimeo.com/search?q=%QUERY%',
		categories: ['video']
	}
] as const;

export const INTEGRATION_CATEGORIES = Array.from(
	new Set(AVAILABLE_INTEGRATIONS.flatMap((integration) => integration.categories))
).sort();

export const GROUPED_INTEGRATIONS = INTEGRATION_CATEGORIES.reduce(
	(acc, category) => {
		acc[category] = AVAILABLE_INTEGRATIONS.filter((integration) =>
			integration.categories.includes(category)
		);
		return acc;
	},
	{} as Record<string, typeof AVAILABLE_INTEGRATIONS>
);
