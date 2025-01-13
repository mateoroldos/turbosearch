export const AVAILABLE_INTEGRATIONS = [
	// General Search
	{
		id: 'google',
		name: 'Google',
		url: 'https://www.google.com/search?q=%QUERY%',
		categories: ['general'],
		icon: 'https://www.google.com/favicon.ico'
	},
	{
		id: 'bing',
		name: 'Bing',
		url: 'https://www.bing.com/search?q=%QUERY%',
		categories: ['general']
	},
	{
		id: 'duckduckgo',
		name: 'DuckDuckGo',
		url: 'https://duckduckgo.com/?q=%QUERY%',
		categories: ['general']
	},

	// Social Media
	{
		id: 'x',
		name: 'X',
		url: 'https://twitter.com/search?q=%QUERY%',
		categories: ['social']
	},
	{
		id: 'facebook',
		name: 'Facebook',
		url: 'https://www.facebook.com/search/top?q=%QUERY%',
		categories: ['social']
	},
	{
		id: 'instagram',
		name: 'Instagram',
		url: 'https://www.instagram.com/explore/tags/%QUERY%',
		categories: ['social']
	},
	{
		id: 'linkedin',
		name: 'LinkedIn',
		url: 'https://www.linkedin.com/search/results/all/?keywords=%QUERY%',
		categories: ['social']
	},

	// Entertainment
	{
		id: 'youtube',
		name: 'YouTube',
		url: 'https://www.youtube.com/results?search_query=%QUERY%',
		categories: ['video', 'entertainment']
	},
	{
		id: 'spotify',
		name: 'Spotify',
		url: 'https://open.spotify.com/search/%QUERY%',
		categories: ['entertainment']
	},
	{
		id: 'vimeo',
		name: 'Vimeo',
		url: 'https://vimeo.com/search?q=%QUERY%',
		categories: ['video']
	},

	// Shopping
	{
		id: 'amazon',
		name: 'Amazon',
		url: 'https://www.amazon.com/s?k=%QUERY%',
		categories: ['shopping']
	},
	{
		id: 'mercadolibre',
		name: 'MercadoLibre',
		url: 'https://listado.mercadolibre.com.ar/%QUERY%',
		categories: ['shopping']
	},

	// AI Tools
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
		id: 'claude',
		name: 'Claude',
		url: 'https://claude.ai/new?q=message=%QUERY%',
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
		categories: ['dev']
	},
	{
		id: 'stackoverflow',
		name: 'Stack Overflow',
		url: 'https://stackoverflow.com/search?q=%QUERY%',
		categories: ['dev']
	},
	{
		id: 'mdn',
		name: 'MDN Docs',
		url: 'https://developer.mozilla.org/en-US/search?q=%QUERY%',
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
