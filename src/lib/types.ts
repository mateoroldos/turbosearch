export type Engine = {
	id: string;
	name: string;
	url: string;
	categories: string[];
};

export type Category = {
	id: string;
	name: string;
};

export type GeneralShortcuts = {
	focusSearch: string;
	exitSearch: string;
};
