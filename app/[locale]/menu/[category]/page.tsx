import { notFound } from "next/navigation";
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { MenuItemRow } from "@/components/menu-item-row";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
	findCategoryBySlug,
	type MenuCategory,
	type MenuItem,
	menu,
} from "@/data/menu";
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
		<section className="flex flex-col gap-8 px-6 py-8 md:px-16 md:py-12">
			<Crumbs category={category} />
			<CategoryHeader category={category} />
			<CategoryContent category={category} />
		</section>
	);
}

function Crumbs({ category }: { category: MenuCategory }) {
	const t = useTranslations("Menu");
	return (
		<Breadcrumb>
			<BreadcrumbList>
				<BreadcrumbItem>
					<BreadcrumbLink render={<Link href="/menu">{t("pageTitle")}</Link>} />
				</BreadcrumbItem>
				<BreadcrumbSeparator />
				<BreadcrumbItem>
					<BreadcrumbPage>
						{t(`categories.${category.id}.title`)}
					</BreadcrumbPage>
				</BreadcrumbItem>
			</BreadcrumbList>
		</Breadcrumb>
	);
}

function CategoryHeader({ category }: { category: MenuCategory }) {
	const t = useTranslations("Menu");
	return (
		<header className="flex flex-col items-start gap-3">
			<h1 className="text-3xl font-medium tracking-tight md:text-5xl">
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
