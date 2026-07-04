This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Menu updates (CSV workflow)

The menu lives in a Google Sheet the owner edits. `src/data/menu.ts` is GENERATED — never edit it by hand.

1. Owner edits the sheet (prices, new rows). Columns: `category,subcategory,item_id,price,price_s,price_l,addon,note`. Either `price` or both `price_s`+`price_l`. Any value in `addon` marks an addon row. `note` is a free-text hint, ignored by the importer. Column order doesn't matter (header-keyed parsing).
2. Download as CSV to `menu/menu.csv`.
3. `bun run menu:import` — regenerates `src/data/menu.ts`, prints added/removed/price-changed items and missing translations.
4. Add missing translations to `messages/{sk,en,de,ru,uk}.json` under `Menu.categories.<category>.items.<item_id>.name` (the report lists exactly which).
5. Test locally (`bun run dev`), then commit and deploy.

`bun run menu:export` regenerates `menu/menu.csv` from the current `menu.ts` (used to seed the sheet; useful if code and sheet drift).

Addons are scoped to their subcategory (rendered as "+" rows under the group). Item-specific addons (e.g. honey for tea) live in that item's own subcategory. New categories need a slug mapping in `scripts/menu-csv.ts` (`CATEGORY_SLUGS`), otherwise the slug falls back to the category id.
