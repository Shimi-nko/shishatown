import path from "node:path";
import type { MenuCategory } from "../src/data/menu";
import { menu as oldMenu } from "../src/data/menu";
import { csvToMenu, generateMenuTs } from "./menu-csv";

const LOCALES = ["sk", "en", "de", "ru", "uk"];
const ROOT = `${import.meta.dir}/..`;

const csvPath = process.argv[2] ?? path.join(ROOT, "menu", "menu.csv");
const csv = await Bun.file(csvPath).text();
const newMenu = csvToMenu(csv);

// --- change report (informational only, nothing blocks) ---
function flatten(menu: MenuCategory[]): Map<string, string> {
	const map = new Map<string, string>();
	for (const category of menu) {
		for (const subcategory of category.subcategories) {
			for (const item of subcategory.items) {
				map.set(
					`${category.id}/${subcategory.id}/${item.id}`,
					JSON.stringify(item.price),
				);
			}
		}
	}
	return map;
}

const before = flatten(oldMenu);
const after = flatten(newMenu);
for (const [key, price] of after) {
	if (!before.has(key)) {
		console.log(`+ added   ${key} ${price}`);
	} else if (before.get(key) !== price) {
		console.log(`~ price   ${key} ${before.get(key)} -> ${price}`);
	}
}
for (const key of before.keys()) {
	if (!after.has(key)) {
		console.log(`- removed ${key}`);
	}
}

// --- missing translations report (the developer's todo list) ---
for (const locale of LOCALES) {
	const messages = await Bun.file(
		path.join(ROOT, "messages", `${locale}.json`),
	).json();
	const categories = messages.Menu?.categories ?? {};
	const missing: string[] = [];
	for (const category of newMenu) {
		if (!categories[category.id]?.title) {
			missing.push(`${category.id} (category title)`);
		}
		for (const subcategory of category.subcategories) {
			if (!categories[category.id]?.subcategories?.[subcategory.id]?.title) {
				missing.push(`${category.id}/${subcategory.id} (subcategory title)`);
			}
			for (const item of subcategory.items) {
				if (!categories[category.id]?.items?.[item.id]?.name) {
					missing.push(`${category.id}/${item.id}`);
				}
			}
		}
	}
	if (missing.length > 0) {
		console.log(`! ${locale} missing translations: ${missing.join(", ")}`);
	}
}

// --- write the generated module ---
const outPath = path.join(ROOT, "src", "data", "menu.ts");
await Bun.write(outPath, generateMenuTs(newMenu));
const format = Bun.spawnSync(["bunx", "biome", "format", "--write", outPath]);
if (format.exitCode !== 0) {
	console.warn(
		`warning: biome format failed (exit ${format.exitCode}); ${outPath} was written but not formatted`,
	);
}
console.log(`wrote ${outPath}`);
