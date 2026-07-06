// Display-only grouping of menu categories. The data model (menu.ts, CSV,
// translations) stays flat — this only shapes how /menu renders sections
// and nav pills. A group's title comes from its first category's title.
export type MenuGroup = {
	id: string;
	categoryIds: string[];
};

export const menuGroups: MenuGroup[] = [
	{ id: "shisha", categoryIds: ["shisha"] },
	{ id: "drinks", categoryIds: ["lemonades", "alcohol", "tea", "coffee"] },
	{ id: "snacks", categoryIds: ["snacks"] },
];
