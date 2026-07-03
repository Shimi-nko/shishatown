// GENERATED from menu/menu.csv — do not edit by hand.
// Regenerate with: bun scripts/import-menu.ts

export type MenuItemPrice = number | { s: number; l: number };

export type MenuItem = {
	id: string;
	price: MenuItemPrice;
	addon?: boolean;
};

export type MenuSubcategory = {
	id: string;
	items: MenuItem[];
};

export type MenuCategory = {
	id: string;
	slug: string;
	subcategories: MenuSubcategory[];
};

export const menu: MenuCategory[] = [
	{
		id: "shisha",
		slug: "tobacco",
		subcategories: [
			{
				id: "tiers",
				items: [
					{ id: "standard", price: 11 },
					{ id: "exclusive", price: 14.9 },
				],
			},
			{
				id: "addons",
				items: [
					{ id: "iceInVase", price: 1, addon: true },
					{ id: "dyeInVase", price: 1.5, addon: true },
					{ id: "fruitInVase", price: 2, addon: true },
				],
			},
		],
	},
	{
		id: "alcohol",
		slug: "alcohol",
		subcategories: [
			{
				id: "shots",
				items: [
					{ id: "russianStandardGold", price: 3.5 },
					{ id: "jackDaniels", price: 3.9 },
					{ id: "jackDanielsSingleBarrel", price: 7.5 },
					{ id: "beefeater", price: 2.9 },
					{ id: "diplomatico", price: 5.9 },
					{ id: "jagermeister", price: 2.9 },
					{ id: "hennessyVS", price: 5.5 },
					{ id: "olmecaPlata", price: 3.9 },
					{ id: "olmecaReposado", price: 3.9 },
					{ id: "havanaClub", price: 3.1 },
					{ id: "baileys", price: 2.9 },
					{ id: "martiniBianco", price: 3.9 },
				],
			},
			{
				id: "cocktails",
				items: [
					{ id: "ginTonic", price: 5.5 },
					{ id: "cubaLibre", price: 5.7 },
					{ id: "mojito", price: 5.8 },
					{ id: "strawberryMojito", price: 5.9 },
					{ id: "luxuryMojito", price: 8.5 },
					{ id: "tequilaSunrise", price: 6.9 },
					{ id: "aperolSpritz", price: 5.5 },
					{ id: "elderflowerSpritz", price: 5.5 },
					{ id: "mimosa", price: 5.5 },
					{ id: "russianStandardRedBull", price: 5.9 },
				],
			},
			{
				id: "prosecco",
				items: [
					{ id: "proseccoDOC", price: 4.5 },
					{ id: "laurentPerrier", price: 99 },
				],
			},
			{
				id: "beer",
				items: [
					{ id: "pilsnerUrquell", price: { s: 1.9, l: 2.9 } },
					{ id: "wywar", price: 2.2 },
					{ id: "radlerNonAlcoholic", price: 2.2 },
				],
			},
			{
				id: "wine",
				items: [
					{ id: "wine", price: 2 },
					{ id: "mulledWine", price: 3.9 },
				],
			},
		],
	},
	{
		id: "snacks",
		slug: "snacks",
		subcategories: [
			{
				id: "food",
				items: [
					{ id: "panini", price: 3.9 },
					{ id: "popcorn", price: 2.1 },
					{ id: "nachos", price: 2.1 },
					{ id: "cheeseSauce", price: 1, addon: true },
					{ id: "peanutPuffs", price: 1.9 },
					{ id: "saltedSticks", price: 1.9 },
				],
			},
			{
				id: "desserts",
				items: [
					{ id: "hotChocolate", price: 3.5 },
					{ id: "granko", price: 2.2 },
				],
			},
		],
	},
	{
		id: "lemonades",
		slug: "lemonades",
		subcategories: [
			{
				id: "homemade",
				items: [
					{ id: "lemonade", price: { s: 2.2, l: 3.3 } },
					{ id: "elderflowerLemon", price: { s: 2.5, l: 3.6 } },
					{ id: "blackcurrantLemon", price: { s: 2.5, l: 3.6 } },
					{ id: "raspberryLemon", price: { s: 2.5, l: 3.6 } },
					{ id: "cherryLemon", price: { s: 2.5, l: 3.6 } },
					{ id: "grapefruitLemon", price: { s: 2.5, l: 3.6 } },
					{ id: "strawberryLemon", price: { s: 2.5, l: 3.6 } },
					{ id: "kiwiLemon", price: { s: 2.5, l: 3.6 } },
					{ id: "mangoLemon", price: { s: 2.5, l: 3.6 } },
					{ id: "mojitoStyle", price: { s: 2.6, l: 3.8 } },
				],
			},
			{
				id: "bottled",
				items: [
					{ id: "cocaCola", price: 2.3 },
					{ id: "cocaColaZero", price: 2.3 },
					{ id: "romerquelle", price: 1.9 },
					{ id: "orangeJuice", price: 1.9 },
					{ id: "kinleyTonic", price: 2.3 },
					{ id: "kinleyBitterRose", price: 2.3 },
					{ id: "kinleyGingerAle", price: 2.3 },
					{ id: "redBull", price: 3 },
				],
			},
			{
				id: "draft",
				items: [
					{ id: "kofola", price: { s: 1.3, l: 1.8 } },
					{ id: "sodaWater", price: { s: 0.9, l: 1.5 } },
				],
			},
		],
	},
	{
		id: "tea",
		slug: "tea",
		subcategories: [
			{
				id: "black",
				items: [
					{ id: "touaregBlack", price: { s: 2.2, l: 3.3 } },
					{ id: "rize", price: { s: 2.2, l: 3.3 } },
				],
			},
			{
				id: "green",
				items: [
					{ id: "touareg", price: { s: 2.2, l: 3.3 } },
					{ id: "chinaJasmin", price: { s: 2.4, l: 3.6 } },
					{ id: "diamondTea", price: { s: 2.4, l: 3.6 } },
				],
			},
			{
				id: "fruit",
				items: [
					{ id: "appleCinnamon", price: { s: 2.4, l: 3.6 } },
					{ id: "strawberriesChampagne", price: { s: 2.4, l: 3.6 } },
					{ id: "kamasutra", price: { s: 2.4, l: 3.6 } },
				],
			},
			{
				id: "fresh",
				items: [
					{ id: "freshGingerTea", price: { s: 2.4, l: 3.6 } },
					{ id: "freshMintTea", price: { s: 2.4, l: 3.6 } },
				],
			},
			{
				id: "mate",
				items: [
					{ id: "mateGreen", price: { s: 2.2, l: 3.3 } },
					{ id: "mateIQ", price: { s: 2.4, l: 3.6 } },
				],
			},
			{
				id: "white",
				items: [{ id: "paiMuTan", price: { s: 2.5, l: 3.8 } }],
			},
			{
				id: "herbal",
				items: [
					{ id: "hibiscus", price: { s: 2.2, l: 3.3 } },
					{ id: "chamomile", price: { s: 2.2, l: 3.3 } },
				],
			},
			{
				id: "rooibos",
				items: [
					{ id: "teaOfPharaohs", price: { s: 2.4, l: 3.6 } },
					{ id: "tantra", price: { s: 2.4, l: 3.6 } },
					{ id: "hercules", price: { s: 2.4, l: 3.6 } },
				],
			},
			{
				id: "rooibosMilk",
				items: [
					{ id: "kingOfMonkeys", price: { s: 3, l: 4.9 } },
					{ id: "littleYeti", price: { s: 3, l: 4.9 } },
					{ id: "tantraMilk", price: { s: 3, l: 4.9 } },
				],
			},
			{
				id: "extras",
				items: [
					{ id: "honey", price: { s: 0.5, l: 1 }, addon: true },
					{ id: "ginger", price: { s: 0.7, l: 1.4 }, addon: true },
					{ id: "lactoseFreeMilk", price: 0.5, addon: true },
				],
			},
		],
	},
	{
		id: "coffee",
		slug: "coffee",
		subcategories: [
			{
				id: "hot",
				items: [
					{ id: "espresso", price: 1.4 },
					{ id: "espressoDoppio", price: 1.9 },
					{ id: "cappuccino", price: 2.1 },
					{ id: "cappuccinoCaramel", price: 2.5 },
					{ id: "cappuccinoChocolate", price: 2.5 },
					{ id: "latteMacchiato", price: 2.3 },
					{ id: "latteMacchiatoCaramel", price: 2.7 },
					{ id: "latteMacchiatoChocolate", price: 2.7 },
				],
			},
			{
				id: "iced",
				items: [
					{ id: "icedCoffee", price: 1.9 },
					{ id: "icedCappuccino", price: 2.3 },
					{ id: "espressoTonic", price: 2.9 },
					{ id: "raspberryEspressoTonic", price: 3.5 },
				],
			},
			{
				id: "extras",
				items: [
					{ id: "honey", price: 0.5, addon: true },
					{ id: "maresiMilk", price: 0.2, addon: true },
					{ id: "topping", price: 0.4, addon: true },
					{ id: "whippedCream", price: 0.5, addon: true },
				],
			},
		],
	},
];

export function findCategoryBySlug(slug: string) {
	return menu.find((c) => c.slug === slug);
}
