export type MenuItemId = string;
export type MenuCategoryId = "shisha" | "coldDrinks" | "hotDrinks" | "snacks";
export type MenuCategorySlug =
	| "tobacco"
	| "cold-drinks"
	| "hot-drinks"
	| "snacks";

export type MenuItem = {
	id: MenuItemId;
	price: number;
};

export type MenuCategory = {
	id: MenuCategoryId;
	slug: MenuCategorySlug;
	items: MenuItem[];
};

export const menu: MenuCategory[] = [
	{
		id: "shisha",
		slug: "tobacco",
		items: [
			{ id: "house", price: 12 },
			{ id: "premium", price: 16 },
			{ id: "experimental", price: 20 },
			{ id: "coalChange", price: 2 },
		],
	},
	{
		id: "coldDrinks",
		slug: "cold-drinks",
		items: [
			{ id: "water", price: 2 },
			{ id: "cola", price: 2.5 },
			{ id: "fanta", price: 2.5 },
			{ id: "redBull", price: 3.5 },
			{ id: "juice", price: 3 },
		],
	},
	{
		id: "hotDrinks",
		slug: "hot-drinks",
		items: [
			{ id: "espresso", price: 1.8 },
			{ id: "cappuccino", price: 2.5 },
			{ id: "tea", price: 2.5 },
			{ id: "hotChocolate", price: 3 },
		],
	},
	{
		id: "snacks",
		slug: "snacks",
		items: [
			{ id: "chips", price: 2 },
			{ id: "nuts", price: 3 },
			{ id: "olives", price: 3.5 },
		],
	},
];

export function findCategoryBySlug(slug: string) {
	return menu.find((c) => c.slug === slug);
}
