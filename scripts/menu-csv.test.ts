import { expect, test } from "bun:test";
import { menu } from "../src/data/menu";
import { CSV_HEADER, csvToMenu, menuToCsv } from "./menu-csv";

test("roundtrip: csvToMenu(menuToCsv(menu)) equals current menu", () => {
	expect(csvToMenu(menuToCsv(menu))).toEqual(menu);
});

test("fixed price row", () => {
	const csv = `${CSV_HEADER}\nsnacks,food,panini,3.90,,,,\n`;
	expect(csvToMenu(csv)).toEqual([
		{
			id: "snacks",
			slug: "snacks",
			subcategories: [{ id: "food", items: [{ id: "panini", price: 3.9 }] }],
		},
	]);
});

test("size-variant price row", () => {
	const csv = `${CSV_HEADER}\nlemonades,homemade,lemonade,,2.20,3.30,,\n`;
	expect(csvToMenu(csv)[0].subcategories[0].items[0]).toEqual({
		id: "lemonade",
		price: { s: 2.2, l: 3.3 },
	});
});

test("addon row sets addon: true", () => {
	const csv = `${CSV_HEADER}\ntea,extras,honey,,0.50,1.00,x,\n`;
	expect(csvToMenu(csv)[0].subcategories[0].items[0]).toEqual({
		id: "honey",
		price: { s: 0.5, l: 1 },
		addon: true,
	});
});

test("note column with a comma does not shift parsed cells", () => {
	const csv = `${CSV_HEADER}\ntea,extras,honey,0.50,,,x,"for tea, not coffee"\n`;
	expect(csvToMenu(csv)[0].subcategories[0].items[0]).toEqual({
		id: "honey",
		price: 0.5,
		addon: true,
	});
});

test("unknown category id falls back to id as slug", () => {
	const csv = `${CSV_HEADER}\nmocktails,classics,virginMojito,4.50,,,,\n`;
	expect(csvToMenu(csv)[0].slug).toBe("mocktails");
});

test("known category ids map to their slugs", () => {
	const csv = `${CSV_HEADER}\nshisha,tiers,standard,11.00,,,,\n`;
	expect(csvToMenu(csv)[0].slug).toBe("tobacco");
});
