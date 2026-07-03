import Papa from "papaparse";
import type { MenuCategory, MenuItem } from "../src/data/menu";

// categoryId -> URL slug. Slugs are a code concern; the owner's sheet never
// contains them. New categories fall back to slug === id until mapped here.
export const CATEGORY_SLUGS: Record<string, string> = {
	shisha: "tobacco",
	alcohol: "alcohol",
	snacks: "snacks",
	lemonades: "lemonades",
	tea: "tea",
	coffee: "coffee",
};

export const CSV_HEADER =
	"category,subcategory,item_id,price,price_s,price_l,addon,note";

export function menuToCsv(menu: MenuCategory[]): string {
	const lines = [CSV_HEADER];
	for (const category of menu) {
		for (const subcategory of category.subcategories) {
			for (const item of subcategory.items) {
				const fixed =
					typeof item.price === "number" ? item.price.toFixed(2) : "";
				const s = typeof item.price === "object" ? item.price.s.toFixed(2) : "";
				const l = typeof item.price === "object" ? item.price.l.toFixed(2) : "";
				lines.push(
					[
						category.id,
						subcategory.id,
						item.id,
						fixed,
						s,
						l,
						item.addon ? "x" : "",
						"",
					].join(","),
				);
			}
		}
	}
	return `${lines.join("\n")}\n`;
}

type CsvRow = {
	category?: string;
	subcategory?: string;
	item_id?: string;
	price?: string;
	price_s?: string;
	price_l?: string;
	addon?: string;
	note?: string;
};

// papaparse handles quoted cells, CRLF, and BOM from Google Sheets exports.
// header: true keys rows by column name, so the owner can reorder or add
// columns in the sheet without breaking the import. The note column is free
// text and never read.
export function csvToMenu(csv: string): MenuCategory[] {
	const parsed = Papa.parse<CsvRow>(csv, {
		header: true,
		skipEmptyLines: true,
		transformHeader: (header) => header.trim(),
		transform: (value) => value.trim(),
	});
	const menu: MenuCategory[] = [];
	for (const row of parsed.data) {
		const categoryId = row.category ?? "";
		const subcategoryId = row.subcategory ?? "";
		const itemId = row.item_id ?? "";
		const price = row.price ?? "";
		const priceS = row.price_s ?? "";
		const priceL = row.price_l ?? "";
		const addon = row.addon ?? "";

		let category = menu.find((c) => c.id === categoryId);
		if (!category) {
			category = {
				id: categoryId,
				slug: CATEGORY_SLUGS[categoryId] ?? categoryId,
				subcategories: [],
			};
			menu.push(category);
		}

		let subcategory = category.subcategories.find(
			(s) => s.id === subcategoryId,
		);
		if (!subcategory) {
			subcategory = { id: subcategoryId, items: [] };
			category.subcategories.push(subcategory);
		}

		const item: MenuItem = {
			id: itemId,
			price:
				price !== "" ? Number(price) : { s: Number(priceS), l: Number(priceL) },
		};
		if (addon) {
			item.addon = true;
		}
		subcategory.items.push(item);
	}
	return menu;
}

const GENERATED_HEADER = `// GENERATED from menu/menu.csv — do not edit by hand.
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
`;

const GENERATED_FOOTER = `];

export function findCategoryBySlug(slug: string) {
	return menu.find((c) => c.slug === slug);
}
`;

export function generateMenuTs(menu: MenuCategory[]): string {
	const lines: string[] = [];
	for (const category of menu) {
		lines.push("\t{");
		lines.push(`\t\tid: "${category.id}",`);
		lines.push(`\t\tslug: "${category.slug}",`);
		lines.push("\t\tsubcategories: [");
		for (const subcategory of category.subcategories) {
			lines.push("\t\t\t{");
			lines.push(`\t\t\t\tid: "${subcategory.id}",`);
			lines.push("\t\t\t\titems: [");
			for (const item of subcategory.items) {
				const price =
					typeof item.price === "number"
						? String(item.price)
						: `{ s: ${item.price.s}, l: ${item.price.l} }`;
				const addon = item.addon ? ", addon: true" : "";
				lines.push(`\t\t\t\t\t{ id: "${item.id}", price: ${price}${addon} },`);
			}
			lines.push("\t\t\t\t],");
			lines.push("\t\t\t},");
		}
		lines.push("\t\t],");
		lines.push("\t},");
	}
	return `${GENERATED_HEADER}${lines.join("\n")}\n${GENERATED_FOOTER}`;
}
