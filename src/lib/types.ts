export type Engine = {
	id: string;
	name: string;
	url: string;
	shortcut?: string;
	categories: string[];
};

export type Category = {
	id: string;
	name: string;
	shortcut: string;
};

export type GeneralShortcuts = {
	focusSearch: string;
	exitSearch: string;
};
