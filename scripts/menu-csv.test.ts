import { expect, test } from "bun:test";
import { menu } from "../src/data/menu";
import { CSV_HEADER, csvToMenu, generateMenuTs, menuToCsv } from "./menu-csv";

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

test("UTF-8 BOM and CRLF line endings parse cleanly", () => {
	const csv = `﻿${CSV_HEADER}\r\nsnacks,food,panini,3.90,,,,\r\n`;
	expect(csvToMenu(csv)[0].subcategories[0].items[0]).toEqual({
		id: "panini",
		price: 3.9,
	});
});

test("short row without trailing columns does not set addon", () => {
	const csv = `${CSV_HEADER}\nsnacks,food,panini,3.90\n`;
	expect(csvToMenu(csv)[0].subcategories[0].items[0].addon).toBeUndefined();
});

test("reordered columns parse identically (header-keyed)", () => {
	const csv =
		"item_id,addon,price,category,note,subcategory,price_s,price_l\nhoney,x,0.50,tea,hint for dev,extras,,\n";
	expect(csvToMenu(csv)).toEqual([
		{
			id: "tea",
			slug: "tea",
			subcategories: [
				{ id: "extras", items: [{ id: "honey", price: 0.5, addon: true }] },
			],
		},
	]);
});

test("unknown category id falls back to id as slug", () => {
	const csv = `${CSV_HEADER}\nmocktails,classics,virginMojito,4.50,,,,\n`;
	expect(csvToMenu(csv)[0].slug).toBe("mocktails");
});

test("known category ids map to their slugs", () => {
	const csv = `${CSV_HEADER}\nshisha,tiers,standard,11.00,,,,\n`;
	expect(csvToMenu(csv)[0].slug).toBe("tobacco");
});

test("generateMenuTs emits a complete typed module", () => {
	const csv = `${CSV_HEADER}\nsnacks,food,panini,3.90,,,,\ntea,extras,honey,,0.50,1.00,x,\n`;
	const source = generateMenuTs(csvToMenu(csv));
	expect(source).toStartWith("// GENERATED from menu/menu.csv");
	expect(source).toContain(
		"export type MenuItemPrice = number | { s: number; l: number };",
	);
	expect(source).toContain('{ id: "panini", price: 3.9 },');
	expect(source).toContain(
		'{ id: "honey", price: { s: 0.5, l: 1 }, addon: true },',
	);
	expect(source).toContain(
		"export function findCategoryBySlug(slug: string) {",
	);
});

test("generateMenuTs emits every category, subcategory, and item", () => {
	const source = generateMenuTs(menu);
	for (const category of menu) {
		expect(source).toContain(`slug: "${category.slug}",`);
		for (const subcategory of category.subcategories) {
			expect(source).toContain(`id: "${subcategory.id}",`);
			for (const item of subcategory.items) {
				expect(source).toContain(`{ id: "${item.id}", price: `);
			}
		}
	}
});
