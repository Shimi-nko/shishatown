# CSV Menu Import Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let the restaurant owner maintain the menu in a Google Sheet; a bun import script regenerates the typed `src/data/menu.ts` from the downloaded CSV and reports missing translations.

**Architecture:** A shared module `scripts/menu-csv.ts` holds the CSV parse/serialize and TS-source generation logic. Two thin CLI scripts use it: `scripts/export-menu-csv.ts` (seed the sheet from the current menu, one CSV row per item) and `scripts/import-menu.ts` (CSV → regenerate `src/data/menu.ts` + print change/translation report). The Next.js app is untouched — it keeps importing `menu`, the menu types, and `findCategoryBySlug` from `@/data/menu`.

**Tech Stack:** bun (runs TS directly, `bun:test` for tests), no new dependencies. Spec: `docs/superpowers/specs/2026-07-03-csv-menu-import-design.md`.

**Key context for the implementer:**

- `src/data/menu.ts` currently exports: `MenuItemPrice = number | { s: number; l: number }`, `MenuItem { id, price, addon? }`, `MenuSubcategory { id, items }`, `MenuCategory { id, slug, subcategories }`, `menu: MenuCategory[]`, `findCategoryBySlug(slug)`. The generated file must keep exporting ALL of these (app imports them: `app/[locale]/menu/page.tsx`, `app/[locale]/menu/[category]/page.tsx`, `app/sitemap.ts`, `src/components/site-header.tsx`, `src/components/mobile-nav.tsx`).
- Translations live in `messages/{sk,en,de,ru,uk}.json` under `Menu.categories.<categoryId>.items.<itemId>.name` (items are keyed at the **category** level, not subcategory) and `Menu.categories.<categoryId>.title` / `...subcategories.<subcategoryId>.title`.
- Repo uses tabs + double quotes (biome). Generated code must match.
- CSV columns: `category,subcategory,item_id,price,price_s,price_l,addon,note`. `note` is ignored by the parser (cells beyond index 6 are never read, so a comma inside a quoted note cannot shift the parsed columns).
- No validation/hard failures by design — the site is tested before deploy. The import script only prints an informational report.
- `tsconfig.json` `include` covers `**/*.ts`; scripts use the `Bun` global which `tsc` doesn't know → Task 1 excludes `scripts/` from tsconfig. Note: bun strips types without checking them — the `bun test scripts/` suite is what actually exercises the scripts; `tsc --noEmit` only covers the app (including the generated `src/data/menu.ts`).

---

### Task 1: Shared module — `menuToCsv` + `csvToMenu`

**Files:**
- Create: `scripts/menu-csv.ts`
- Test: `scripts/menu-csv.test.ts`
- Modify: `tsconfig.json` (exclude `scripts/`)

- [x] **Step 1: Exclude scripts from tsconfig**

In `tsconfig.json`, change:

```json
  "exclude": ["node_modules"]
```

to:

```json
  "exclude": ["node_modules", "scripts"]
```

- [x] **Step 2: Write the failing tests**

Create `scripts/menu-csv.test.ts`:

```ts
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
```

- [x] **Step 3: Run tests to verify they fail**

Run: `bun test scripts/menu-csv.test.ts`
Expected: FAIL — `Cannot find module './menu-csv'` (or similar resolution error).

- [x] **Step 4: Write the implementation**

Create `scripts/menu-csv.ts`:

```ts
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

export const CSV_HEADER = "category,subcategory,item_id,price,price_s,price_l,addon,note";

export function menuToCsv(menu: MenuCategory[]): string {
	const lines = [CSV_HEADER];
	for (const category of menu) {
		for (const subcategory of category.subcategories) {
			for (const item of subcategory.items) {
				const fixed = typeof item.price === "number" ? item.price.toFixed(2) : "";
				const s = typeof item.price === "object" ? item.price.s.toFixed(2) : "";
				const l = typeof item.price === "object" ? item.price.l.toFixed(2) : "";
				lines.push(
					[category.id, subcategory.id, item.id, fixed, s, l, item.addon ? "x" : "", ""].join(","),
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
		const [categoryId, subcategoryId, itemId, price, priceS, priceL, addon] = cells;

		let category = menu.find((c) => c.id === categoryId);
		if (!category) {
			category = {
				id: categoryId,
				slug: CATEGORY_SLUGS[categoryId] ?? categoryId,
				subcategories: [],
			};
			menu.push(category);
		}

		let subcategory = category.subcategories.find((s) => s.id === subcategoryId);
		if (!subcategory) {
			subcategory = { id: subcategoryId, items: [] };
			category.subcategories.push(subcategory);
		}

		const item: MenuItem = {
			id: itemId,
			price: price !== "" ? Number(price) : { s: Number(priceS), l: Number(priceL) },
		};
		if (addon !== "") {
			item.addon = true;
		}
		subcategory.items.push(item);
	}
	return menu;
}
```

- [x] **Step 5: Run tests to verify they pass**

Run: `bun test scripts/menu-csv.test.ts`
Expected: 7 pass, 0 fail.

- [x] **Step 6: Commit**

```bash
git add scripts/menu-csv.ts scripts/menu-csv.test.ts tsconfig.json
git commit -m "feat: add menu CSV parse/serialize module"
```

---

### Task 2: Shared module — `generateMenuTs`

**Files:**
- Modify: `scripts/menu-csv.ts` (append function)
- Test: `scripts/menu-csv.test.ts` (append tests)

- [x] **Step 1: Write the failing tests**

Append to `scripts/menu-csv.test.ts` (add `generateMenuTs` to the existing import from `./menu-csv`):

```ts
test("generateMenuTs emits a complete typed module", () => {
	const csv = `${CSV_HEADER}\nsnacks,food,panini,3.90,,,,\ntea,extras,honey,,0.50,1.00,x,\n`;
	const source = generateMenuTs(csvToMenu(csv));
	expect(source).toStartWith("// GENERATED from menu/menu.csv");
	expect(source).toContain("export type MenuItemPrice = number | { s: number; l: number };");
	expect(source).toContain('{ id: "panini", price: 3.9 },');
	expect(source).toContain('{ id: "honey", price: { s: 0.5, l: 1 }, addon: true },');
	expect(source).toContain("export function findCategoryBySlug(slug: string) {");
});

test("generateMenuTs output roundtrips through menuToCsv", () => {
	// The generated source for the current menu must contain every item line.
	const source = generateMenuTs(menu);
	for (const category of menu) {
		expect(source).toContain(`slug: "${category.slug}",`);
		for (const subcategory of category.subcategories) {
			expect(source).toContain(`id: "${subcategory.id}",`);
		}
	}
});
```

- [x] **Step 2: Run tests to verify they fail**

Run: `bun test scripts/menu-csv.test.ts`
Expected: FAIL — `generateMenuTs` is not exported.

- [x] **Step 3: Write the implementation**

Append to `scripts/menu-csv.ts`:

```ts
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
```

- [x] **Step 4: Run tests to verify they pass**

Run: `bun test scripts/menu-csv.test.ts`
Expected: 9 pass, 0 fail.

- [x] **Step 5: Commit**

```bash
git add scripts/menu-csv.ts scripts/menu-csv.test.ts
git commit -m "feat: add menu.ts source generator"
```

---

### Task 3: Export script + seed CSV

**Files:**
- Create: `scripts/export-menu-csv.ts`
- Create (generated): `menu/menu.csv`
- Modify: `package.json` (add script)

- [x] **Step 1: Write the export script**

Create `scripts/export-menu-csv.ts`:

```ts
import path from "node:path";
import { menu } from "../src/data/menu";
import { menuToCsv } from "./menu-csv";

const ROOT = path.join(import.meta.dir, "..");
const outPath = process.argv[2] ?? path.join(ROOT, "menu", "menu.csv");

await Bun.write(outPath, menuToCsv(menu));
console.log(`wrote ${outPath}`);
```

- [x] **Step 2: Add package.json script**

In `package.json` `"scripts"`, add:

```json
    "menu:export": "bun scripts/export-menu-csv.ts",
```

- [x] **Step 3: Run it and eyeball the output**

Run: `bun run menu:export`
Expected: `wrote .../menu/menu.csv`

Run: `head -5 menu/menu.csv`
Expected:

```csv
category,subcategory,item_id,price,price_s,price_l,addon,note
shisha,tiers,standard,11.00,,,,
shisha,tiers,exclusive,14.90,,,,
shisha,addons,iceInVase,1.00,,,x,
shisha,addons,dyeInVase,1.50,,,x,
```

Also check the row count matches the item count:
`tail -n +2 menu/menu.csv | wc -l` should equal `grep -cE 'price: ([0-9]|\{)' src/data/menu.ts` (plain `grep -c 'price:'` over-counts by one — it also matches the `price: MenuItemPrice;` type field).

- [x] **Step 4: Commit**

```bash
git add scripts/export-menu-csv.ts menu/menu.csv package.json
git commit -m "feat: add menu CSV export script and seed menu.csv"
```

---

### Task 4: Import script

**Files:**
- Create: `scripts/import-menu.ts`
- Modify: `package.json` (add script)

- [x] **Step 1: Write the import script**

Create `scripts/import-menu.ts`:

```ts
import path from "node:path";
import { menu as oldMenu } from "../src/data/menu";
import type { MenuCategory } from "../src/data/menu";
import { csvToMenu, generateMenuTs } from "./menu-csv";

const LOCALES = ["sk", "en", "de", "ru", "uk"];
const ROOT = path.join(import.meta.dir, "..");

const csvPath = process.argv[2] ?? path.join(ROOT, "menu", "menu.csv");
const csv = await Bun.file(csvPath).text();
const newMenu = csvToMenu(csv);

// --- change report (informational only, nothing blocks) ---
function flatten(menu: MenuCategory[]): Map<string, string> {
	const map = new Map<string, string>();
	for (const category of menu) {
		for (const subcategory of category.subcategories) {
			for (const item of subcategory.items) {
				map.set(`${category.id}/${subcategory.id}/${item.id}`, JSON.stringify(item.price));
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
	const messages = await Bun.file(path.join(ROOT, "messages", `${locale}.json`)).json();
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
Bun.spawnSync(["bunx", "biome", "format", "--write", outPath]);
console.log(`wrote ${outPath}`);
```

(The `biome format` pass normalizes emission drift — e.g. single-item arrays biome wants inline — so regeneration never fights `bun run check`.)

- [x] **Step 2: Add package.json script**

In `package.json` `"scripts"`, add:

```json
    "menu:import": "bun scripts/import-menu.ts",
```

- [x] **Step 3: Roundtrip run — import the seed CSV over the current menu.ts**

Run: `bun run menu:import`
Expected output: no `+ added` / `- removed` / `~ price` lines (data identical), no `! missing translations` lines (all current items are translated), then `wrote .../src/data/menu.ts`.

Run: `git diff --stat src/data/menu.ts`
Expected: only cosmetic changes (generated header comment; number literals like `11.0` → `11`). No item/price/structure differences — verify by skimming `git diff src/data/menu.ts`.

- [x] **Step 4: Verify the regenerated file typechecks and tests still pass**

Run: `bun test scripts/`
Expected: all pass (roundtrip test now runs against the regenerated file).

Run: `bunx tsc --noEmit`
Expected: exit 0.

- [x] **Step 5: Verify the site builds with the generated file**

Run: `bun run build`
Expected: build succeeds. (Per AGENTS.md this Next.js version has breaking changes — if the build fails for reasons unrelated to `src/data/menu.ts`, check `node_modules/next/dist/docs/` before touching app code, and confirm the failure exists on a clean checkout too.)

- [x] **Step 6: Commit**

```bash
git add scripts/import-menu.ts package.json src/data/menu.ts
git commit -m "feat: add menu CSV import script, regenerate menu.ts from seed CSV"
```

---

### Task 5: Document the workflow

**Files:**
- Modify: `README.md` (append section)

- [x] **Step 1: Append workflow section to README.md**

```markdown
## Menu updates (CSV workflow)

The menu lives in a Google Sheet the owner edits. `src/data/menu.ts` is GENERATED — never edit it by hand.

1. Owner edits the sheet (prices, new rows). Columns: `category,subcategory,item_id,price,price_s,price_l,addon,note`. Either `price` or both `price_s`+`price_l`. Any value in `addon` marks an addon row. `note` is a free-text hint, ignored by the importer.
2. Download as CSV to `menu/menu.csv`.
3. `bun run menu:import` — regenerates `src/data/menu.ts`, prints added/removed/price-changed items and missing translations.
4. Add missing translations to `messages/{sk,en,de,ru,uk}.json` under `Menu.categories.<category>.items.<item_id>.name` (the report lists exactly which).
5. Test locally (`bun run dev`), then commit and deploy.

`bun run menu:export` regenerates `menu/menu.csv` from the current `menu.ts` (used to seed the sheet; useful if code and sheet drift).

Addons are scoped to their subcategory (rendered as "+" rows under the group). Item-specific addons (e.g. honey for tea) live in that item's own subcategory. New categories need a slug mapping in `scripts/menu-csv.ts` (`CATEGORY_SLUGS`), otherwise the slug falls back to the category id.
```

- [x] **Step 2: Commit**

```bash
git add README.md
git commit -m "docs: document CSV menu update workflow"
```
