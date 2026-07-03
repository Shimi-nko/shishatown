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

// Naive comma split is safe: the only free-text column (note) is last and
// ignored, so a quoted comma inside it can only produce extra cells beyond
// index 6, which are never read.
export function csvToMenu(csv: string): MenuCategory[] {
	const lines = csv.split(/\r?\n/).filter((line) => line.trim() !== "");
	const menu: MenuCategory[] = [];
	for (const line of lines.slice(1)) {
		const cells = line.split(",").map((cell) => cell.trim());
		const [categoryId, subcategoryId, itemId, price, priceS, priceL, addon] =
			cells;

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
		if (addon !== "") {
			item.addon = true;
		}
		subcategory.items.push(item);
	}
	return menu;
}
