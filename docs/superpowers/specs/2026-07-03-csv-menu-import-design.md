# CSV Menu Import — Design

**Date:** 2026-07-03
**Status:** Approved pending user review

## Problem

The restaurant owner (non-developer) needs to update the menu — prices, adding/removing items — without editing TypeScript or JSON. Today the menu lives in `src/data/menu.ts` (typed, hierarchical: category → subcategory → item) with item names translated in 5 locale files (`messages/{sk,en,de,ru,uk}.json`) keyed by item id.

## Decision

The owner edits a Google Sheet. The developer downloads it as CSV and runs an import script that regenerates `src/data/menu.ts`. Translations stay owned in the app (locale JSONs); the developer adds translations for new items before deploying. The app itself is unchanged — it keeps importing typed `menu.ts`.

Rejected alternatives:

- **CSV parsed at build time** — moves parse logic into the app, weaker typing, same outcome with more moving parts.
- **No CSV (hand-edit TS from the sheet)** — error-prone manual diffing.
- **Admin UI / OBERON stock cards as menu source** — out of scope for now; may supersede this later.

## CSV Schema

One row per item. Row order = display order (categories, subcategories, and items appear in the order their rows appear).

```csv
category,subcategory,item_id,price,price_s,price_l,addon,note
shisha,tiers,standard,11.00,,,,
shisha,addons,iceInVase,1.00,,,x,
alcohol,beer,pilsnerUrquell,,1.90,2.90,,
lemonades,homemade,lemonade,,2.20,3.30,,
```

- `price` XOR (`price_s` + `price_l`): fixed price or size-variant price.
- `addon`: any non-empty value → `addon: true`. Multiple addons per group are just multiple rows. Addons are scoped to their **subcategory** (rendered as indented "+" rows under that group), not linked to a specific item — when an addon applies to only one item (e.g. honey/milk/lemon for tea), give that item its own subcategory and put the addon rows there.
- `note`: ignored by the script. Free-text hint column for the owner (e.g. the name of a new item so the developer can pick a proper camelCase `item_id` and write translations).
- Category slugs (`shisha` → `tobacco`, etc.) live in a config map inside the script, not in the CSV. The owner never touches slugs.

## Import Script

`scripts/import-menu.ts`, run with bun:

```
bun scripts/import-menu.ts menu/menu.csv
```

1. Parse the CSV (hand-rolled split parser; data has no quoted commas. Switch to a tiny csv lib only if that changes).
2. Rebuild the category → subcategory → item hierarchy from the `category`/`subcategory` columns, preserving row order.
3. Generate `src/data/menu.ts` with the existing types (`MenuCategory`, `MenuSubcategory`, `MenuItem`, `MenuItemPrice`) and a header comment: `// GENERATED from menu.csv — edit via scripts/import-menu.ts`.
4. Print an informational report (nothing blocks generation):
   - items added / removed / price-changed vs the previous `menu.ts`
   - item ids missing a translation in any of the 5 locale JSONs, per locale — this is the developer's "translations to create" todo list

No validation / hard failures — per explicit decision, correctness is verified by testing the site before deploy.

## Workflow

1. Owner edits the Google Sheet, notifies the developer.
2. Developer downloads CSV to `menu/menu.csv`.
3. Developer runs the import script.
4. Developer adds any missing translations to the 5 locale JSONs (script report lists exactly which).
5. `git diff` sanity check → test locally → commit + deploy.

## Testing

- Roundtrip: a CSV representing the current menu must regenerate a `menu.ts` equivalent to the existing one (same data).
- The generated file must typecheck (`tsc --noEmit` / existing build).
- Manual site test before deploy is the acceptance gate (per workflow decision).
