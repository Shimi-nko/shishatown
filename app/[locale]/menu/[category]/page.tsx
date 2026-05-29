import { notFound } from "next/navigation";
import { useFormatter, useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { findCategoryBySlug, type MenuCategory, menu } from "@/data/menu";
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
			<CategoryItems category={category} />
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

function CategoryItems({ category }: { category: MenuCategory }) {
	const t = useTranslations("Menu");
	const format = useFormatter();
	const currency = t("currency");
	return (
		<ul className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-6 text-card-foreground">
			{category.items.map((item) => {
				const base = `categories.${category.id}.items.${item.id}` as const;
				const hasDescription = t.has(`${base}.description`);
				return (
					<li
						key={item.id}
						className="flex items-baseline gap-3 border-b border-dashed border-border/60 pb-3 last:border-b-0 last:pb-0"
					>
						<div className="flex flex-col">
							<span className="font-medium">{t(`${base}.name`)}</span>
							{hasDescription && (
								<span className="text-sm text-foreground/70">
									{t(`${base}.description`)}
								</span>
							)}
						</div>
						<span className="flex-1" aria-hidden />
						<span className="font-medium tabular-nums">
							{format.number(item.price, { style: "currency", currency })}
						</span>
					</li>
				);
			})}
		</ul>
	);
}
