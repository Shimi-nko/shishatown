import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { MenuItemRow } from "@/components/menu-item-row";
import { MenuNav } from "@/components/menu-nav";
import { type MenuCategory, menu } from "@/data/menu";

type Props = {
	params: Promise<{ locale: string }>;
};

export default async function MenuPage({ params }: Props) {
	const { locale } = await params;
	setRequestLocale(locale);

	return (
		<section className="flex flex-col gap-10 px-6 py-8 md:px-16 md:py-12">
			<MenuHeader />
			<CategoryNav />
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
		<header className="flex flex-col items-start gap-3">
			<span className="h-0.5 w-8 rounded-full bg-brand-accent" aria-hidden />
			<h1 className="text-3xl font-medium tracking-tight md:text-5xl">
				{t("pageTitle")}
			</h1>
			<p className="max-w-2xl text-base text-foreground/80">
				{t("pageSubtitle")}
			</p>
		</header>
	);
}

function CategoryNav() {
	const t = useTranslations("Menu");
	return (
		<MenuNav
			sections={menu.map((category) => ({
				id: category.id,
				label: t(`categories.${category.id}.title`),
			}))}
		/>
	);
}

function MenuCategorySection({ category }: { category: MenuCategory }) {
	const t = useTranslations("Menu");
	return (
		<section id={category.id} className="flex flex-col gap-4 scroll-mt-20">
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
