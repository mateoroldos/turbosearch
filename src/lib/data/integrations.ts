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
	},

	// Academic & Research
	{
		id: 'scholar',
		name: 'Google Scholar',
		url: 'https://scholar.google.com/scholar?q=%QUERY%',
		categories: ['academic', 'research']
	},
	{
		id: 'arxiv',
		name: 'arXiv',
		url: 'https://arxiv.org/search/?query=%QUERY%',
		categories: ['academic', 'research']
	},
	{
		id: 'pubmed',
		name: 'PubMed',
		url: 'https://pubmed.ncbi.nlm.nih.gov/?term=%QUERY%',
		categories: ['academic', 'research', 'medical']
	},

	// Technical Documentation
	{
		id: 'readthedocs',
		name: 'Read the Docs',
		url: 'https://readthedocs.org/search/?q=%QUERY%',
		categories: ['dev', 'docs']
	},
	{
		id: 'docker',
		name: 'Docker Hub',
		url: 'https://hub.docker.com/search?q=%QUERY%',
		categories: ['dev', 'docs']
	},

	// Learning Platforms
	{
		id: 'coursera',
		name: 'Coursera',
		url: 'https://www.coursera.org/search?query=%QUERY%',
		categories: ['learning', 'education']
	},
	{
		id: 'udemy',
		name: 'Udemy',
		url: 'https://www.udemy.com/courses/search/?q=%QUERY%',
		categories: ['learning', 'education']
	},
	{
		id: 'edx',
		name: 'edX',
		url: 'https://www.edx.org/search?q=%QUERY%',
		categories: ['learning', 'education']
	},

	// More Shopping
	{
		id: 'ebay',
		name: 'eBay',
		url: 'https://www.ebay.com/sch/i.html?_nkw=%QUERY%',
		categories: ['shopping']
	},
	{
		id: 'aliexpress',
		name: 'AliExpress',
		url: 'https://www.aliexpress.com/wholesale?SearchText=%QUERY%',
		categories: ['shopping']
	},
	{
		id: 'etsy',
		name: 'Etsy',
		url: 'https://www.etsy.com/search?q=%QUERY%',
		categories: ['shopping', 'crafts']
	},

	// More Entertainment
	{
		id: 'netflix',
		name: 'Netflix',
		url: 'https://www.netflix.com/search?q=%QUERY%',
		categories: ['entertainment', 'video']
	},
	{
		id: 'imdb',
		name: 'IMDb',
		url: 'https://www.imdb.com/find?q=%QUERY%',
		categories: ['entertainment', 'video']
	},
	{
		id: 'goodreads',
		name: 'Goodreads',
		url: 'https://www.goodreads.com/search?q=%QUERY%',
		categories: ['entertainment', 'books']
	},

	// Image Search
	{
		id: 'unsplash',
		name: 'Unsplash',
		url: 'https://unsplash.com/s/photos/%QUERY%',
		categories: ['images', 'design']
	},
	{
		id: 'pexels',
		name: 'Pexels',
		url: 'https://www.pexels.com/search/%QUERY%',
		categories: ['images', 'design']
	},
	{
		id: 'pixabay',
		name: 'Pixabay',
		url: 'https://pixabay.com/images/search/%QUERY%',
		categories: ['images', 'design']
	},

	// Professional Development
	{
		id: 'glassdoor',
		name: 'Glassdoor',
		url: 'https://www.glassdoor.com/Search/results.htm?keyword=%QUERY%',
		categories: ['jobs', 'professional']
	},
	{
		id: 'indeed',
		name: 'Indeed',
		url: 'https://www.indeed.com/jobs?q=%QUERY%',
		categories: ['jobs', 'professional']
	},

	// More Development
	{
		id: 'gitlab',
		name: 'GitLab',
		url: 'https://gitlab.com/search?search=%QUERY%',
		categories: ['dev']
	},
	{
		id: 'codepen',
		name: 'CodePen',
		url: 'https://codepen.io/search/pens?q=%QUERY%',
		categories: ['dev', 'design']
	},

	// Reference
	{
		id: 'wikipedia',
		name: 'Wikipedia',
		url: 'https://en.wikipedia.org/w/index.php?search=%QUERY%',
		categories: ['reference', 'education']
	},
	{
		id: 'wolframalpha',
		name: 'Wolfram Alpha',
		url: 'https://www.wolframalpha.com/input?i=%QUERY%',
		categories: ['reference', 'education', 'science']
	},

	// Maps & Location
	{
		id: 'googlemaps',
		name: 'Google Maps',
		url: 'https://www.google.com/maps/search/%QUERY%',
		categories: ['maps', 'travel']
	},
	{
		id: 'openstreetmap',
		name: 'OpenStreetMap',
		url: 'https://www.openstreetmap.org/search?query=%QUERY%',
		categories: ['maps', 'travel']
	},

	// Translation
	{
		id: 'translate',
		name: 'Google Translate',
		url: 'https://translate.google.com/?text=%QUERY%',
		categories: ['translation', 'language']
	},
	{
		id: 'deepl',
		name: 'DeepL',
		url: 'https://www.deepl.com/translator#en/es/%QUERY%',
		categories: ['translation', 'language']
	},

	// Tech News
	{
		id: 'techcrunch',
		name: 'TechCrunch',
		url: 'https://search.techcrunch.com/search;?p=%QUERY%',
		categories: ['news', 'tech']
	},
	{
		id: 'theverge',
		name: 'The Verge',
		url: 'https://www.theverge.com/search?q=%QUERY%',
		categories: ['news', 'tech']
	},

	// Finance - Traditional
	{
		id: 'yahoo-finance',
		name: 'Yahoo Finance',
		url: 'https://finance.yahoo.com/quote/%QUERY%',
		categories: ['finance', 'stocks']
	},
	{
		id: 'tradingview',
		name: 'TradingView',
		url: 'https://www.tradingview.com/symbols/%QUERY%',
		categories: ['finance', 'stocks', 'crypto']
	},
	{
		id: 'bloomberg',
		name: 'Bloomberg',
		url: 'https://www.bloomberg.com/search?query=%QUERY%',
		categories: ['finance', 'news']
	},
	{
		id: 'marketwatch',
		name: 'MarketWatch',
		url: 'https://www.marketwatch.com/search?q=%QUERY%',
		categories: ['finance', 'stocks']
	},
	{
		id: 'investing',
		name: 'Investing.com',
		url: 'https://www.investing.com/search/?q=%QUERY%',
		categories: ['finance', 'stocks', 'crypto']
	},
	{
		id: 'finviz',
		name: 'Finviz',
		url: 'https://finviz.com/search.ashx?p=%QUERY%',
		categories: ['finance', 'stocks']
	},

	// Crypto
	{
		id: 'coinmarketcap',
		name: 'CoinMarketCap',
		url: 'https://coinmarketcap.com/search/?q=%QUERY%',
		categories: ['crypto']
	},
	{
		id: 'coingecko',
		name: 'CoinGecko',
		url: 'https://www.coingecko.com/en/search?query=%QUERY%',
		categories: ['crypto']
	},
	{
		id: 'binance',
		name: 'Binance',
		url: 'https://www.binance.com/en/trade/%QUERY%',
		categories: ['crypto', 'exchange']
	},
	{
		id: 'coinbase',
		name: 'Coinbase',
		url: 'https://www.coinbase.com/price/%QUERY%',
		categories: ['crypto', 'exchange']
	},
	{
		id: 'etherscan',
		name: 'Etherscan',
		url: 'https://etherscan.io/search?f=0&q=%QUERY%',
		categories: ['crypto', 'blockchain']
	},
	{
		id: 'bscscan',
		name: 'BSCscan',
		url: 'https://bscscan.com/search?f=0&q=%QUERY%',
		categories: ['crypto', 'blockchain']
	},

	// Crypto News & Analysis
	{
		id: 'cointelegraph',
		name: 'CoinTelegraph',
		url: 'https://cointelegraph.com/search?query=%QUERY%',
		categories: ['crypto', 'news']
	},
	{
		id: 'decrypt',
		name: 'Decrypt',
		url: 'https://decrypt.co/search?q=%QUERY%',
		categories: ['crypto', 'news']
	},
	{
		id: 'defillama',
		name: 'DefiLlama',
		url: 'https://defillama.com/search?q=%QUERY%',
		categories: ['crypto', 'defi']
	},
	{
		id: 'dexscreener',
		name: 'DexScreener',
		url: 'https://dexscreener.com/search?q=%QUERY%',
		categories: ['crypto', 'defi']
	},

	// Financial Research & Tools
	{
		id: 'seekingalpha',
		name: 'Seeking Alpha',
		url: 'https://seekingalpha.com/search?q=%QUERY%',
		categories: ['finance', 'research']
	},
	{
		id: 'morningstar',
		name: 'Morningstar',
		url: 'https://www.morningstar.com/search?query=%QUERY%',
		categories: ['finance', 'research']
	},
	{
		id: 'fool',
		name: 'Motley Fool',
		url: 'https://www.fool.com/search?q=%QUERY%',
		categories: ['finance', 'research']
	},
	{
		id: 'zacks',
		name: 'Zacks',
		url: 'https://www.zacks.com/search.php?q=%QUERY%',
		categories: ['finance', 'research']
	},

	// Financial Data & SEC Filings
	{
		id: 'edgar',
		name: 'SEC EDGAR',
		url: 'https://www.sec.gov/edgar/search/#/q=%QUERY%',
		categories: ['finance', 'research', 'legal']
	},
	{
		id: 'openinsider',
		name: 'OpenInsider',
		url: 'http://openinsider.com/search?q=%QUERY%',
		categories: ['finance', 'stocks']
	}
] as const;

export const INTEGRATION_CATEGORIES = Array.from(
	new Set(AVAILABLE_INTEGRATIONS.flatMap((integration) => integration.categories))
).sort();

export const GROUPED_INTEGRATIONS = INTEGRATION_CATEGORIES.reduce(
	(acc, group) => {
		acc[group] = AVAILABLE_INTEGRATIONS.filter((integration) =>
			integration.categories.includes(group)
		);
		return acc;
	},
	{} as Record<string, typeof AVAILABLE_INTEGRATIONS>
);
