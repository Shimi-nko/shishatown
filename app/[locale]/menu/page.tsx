import { useFormatter, useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { menu, type MenuCategory, type MenuItem, type MenuItemPrice } from "@/data/menu";

type Props = {
	params: Promise<{ locale: string }>;
};

export default async function MenuPage({ params }: Props) {
	const { locale } = await params;
	setRequestLocale(locale);

	return (
		<section className="flex flex-col gap-12 px-6 py-8 md:px-16 md:py-12">
			<MenuHeader />
			<div className="flex flex-col gap-12">
				{menu.map((category) => (
					<MenuCategorySection key={category.id} category={category} />
				))}
			</div>
		</section>
	);
}

function MenuHeader() {
	const t = useTranslations("Menu");
	return (
		<header className="flex flex-col items-start gap-4">
			<h1 className="rounded-lg bg-brand-accent px-4 py-2 text-3xl font-medium text-brand-accent-foreground md:text-5xl">
				{t("pageTitle")}
			</h1>
			<p className="max-w-2xl text-base text-foreground/80">
				{t("pageSubtitle")}
			</p>
		</header>
	);
}

function MenuCategorySection({ category }: { category: MenuCategory }) {
	const t = useTranslations("Menu");
	return (
		<section className="flex flex-col gap-4">
			<h2 className="text-xl font-semibold uppercase tracking-wide">
				{t(`categories.${category.id}.title`)}
			</h2>
			<div className="flex flex-col gap-6">
				{category.subcategories.map((sub) => (
					<div key={sub.id} className="flex flex-col gap-2">
						<h3 className="text-sm font-semibold uppercase tracking-widest text-foreground/50">
							{t(`categories.${category.id}.subcategories.${sub.id}.title`)}
						</h3>
						<ul className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-6 text-card-foreground">
							{sub.items.map((item) => (
								<MenuItemRow
									key={item.id}
									item={item}
									categoryId={category.id}
								/>
							))}
						</ul>
					</div>
				))}
			</div>
		</section>
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