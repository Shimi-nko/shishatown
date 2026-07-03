import { notFound } from "next/navigation";
import { useFormatter, useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { findCategoryBySlug, type MenuCategory, type MenuItem, type MenuItemPrice, menu } from "@/data/menu";
import { Link } from "@/i18n/navigation";

type Props = {
	params: Promise<{ locale: string; category: string }>;
};

export function generateStaticParams() {
	return menu.map((c) => ({ category: c.slug }));
}

export default async function MenuCategoryPage({ params }: Props) {
	const { locale, category: slug } = await params;
	setRequestLocale(locale);
	const category = findCategoryBySlug(slug);
	if (!category) notFound();

	return (
		<section className="flex flex-col gap-10 px-6 py-8 md:px-16 md:py-12">
			<Crumbs />
			<CategoryHeader category={category} />
			<CategoryContent category={category} />
		</section>
	);
}

function Crumbs() {
	const t = useTranslations("Menu");
	return (
		<Link href="/menu" className="text-sm text-foreground/70 hover:underline">
			← {t("pageTitle")}
		</Link>
	);
}

function CategoryHeader({ category }: { category: MenuCategory }) {
	const t = useTranslations("Menu");
	return (
		<header className="flex flex-col items-start gap-4">
			<h1 className="rounded-lg bg-brand-accent px-4 py-2 text-3xl font-medium text-brand-accent-foreground md:text-5xl">
				{t(`categories.${category.id}.title`)}
			</h1>
		</header>
	);
}

function CategoryContent({ category }: { category: MenuCategory }) {
	return (
		<div className="flex flex-col gap-6">
			{category.subcategories.map((sub) => (
				<SubcategorySection
					key={sub.id}
					subcategoryId={sub.id}
					categoryId={category.id}
					items={sub.items}
				/>
			))}
		</div>
	);
}

function SubcategorySection({
	subcategoryId,
	categoryId,
	items,
}: {
	subcategoryId: string;
	categoryId: string;
	items: MenuItem[];
}) {
	const t = useTranslations("Menu");
	return (
		<div className="flex flex-col gap-2">
			<h2 className="text-sm font-semibold uppercase tracking-widest text-foreground/50">
				{t(`categories.${categoryId}.subcategories.${subcategoryId}.title`)}
			</h2>
			<ul className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-6 text-card-foreground">
				{items.map((item) => (
					<MenuItemRow key={item.id} item={item} categoryId={categoryId} />
				))}
			</ul>
		</div>
	);
}

function MenuItemRow({
	item,
	categoryId,
}: {
	item: MenuItem;
	categoryId: string;
}) {
	const t = useTranslations("Menu");
	const format = useFormatter();
	const currency = t("currency");
	const base = `categories.${categoryId}.items.${item.id}` as const;
	const hasDescription = t.has(`${base}.description`);

	return (
		<li
			className={`flex items-baseline gap-3 border-b border-dashed border-border/60 pb-3 last:border-b-0 last:pb-0 ${item.addon ? "pl-3 opacity-80" : ""}`}
		>
			<div className="flex flex-col">
				<span className={`font-medium ${item.addon ? "text-sm" : ""}`}>
					{item.addon && <span className="mr-1 text-foreground/50">+</span>}
					{t(`${base}.name`)}
				</span>
				{hasDescription && (
					<span className="text-sm text-foreground/70">
						{t(`${base}.description`)}
					</span>
				)}
			</div>
			<span className="flex-1" aria-hidden />
			<PriceDisplay price={item.price} format={format} currency={currency} />
		</li>
	);
}

function PriceDisplay({
	price,
	format,
	currency,
}: {
	price: MenuItemPrice;
	format: ReturnType<typeof useFormatter>;
	currency: string;
}) {
	const fmt = (n: number) =>
		format.number(n, { style: "currency", currency });

	if (typeof price === "number") {
		return <span className="font-medium tabular-nums">{fmt(price)}</span>;
	}

	return (
		<span className="font-medium tabular-nums whitespace-nowrap">
			{fmt(price.s)}
			<span className="mx-1 text-foreground/40">/</span>
			{fmt(price.l)}
		</span>
	);
}