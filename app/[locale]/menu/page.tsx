import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { MenuItemRow } from "@/components/menu-item-row";
import { MenuNav } from "@/components/menu-nav";
import { type MenuCategory, menu } from "@/data/menu";
import { type MenuGroup, menuGroups } from "@/data/menu-groups";

type Props = {
	params: Promise<{ locale: string }>;
};

export default async function MenuPage({ params }: Props) {
	const { locale } = await params;
	setRequestLocale(locale);

	return (
		<section className="flex flex-col gap-10 px-6 py-8 md:px-16 md:py-12">
			<MenuHeader />
			<GroupNav />
			<div className="flex flex-col gap-12">
				{menuGroups.map((group) => (
					<MenuGroupSection key={group.id} group={group} />
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

// A group's title comes from its first category's title.
function GroupNav() {
	const t = useTranslations("Menu");
	return (
		<MenuNav
			sections={menuGroups.map((group) => ({
				id: group.id,
				label: t(`categories.${group.categoryIds[0]}.title`),
			}))}
		/>
	);
}

function MenuGroupSection({ group }: { group: MenuGroup }) {
	const t = useTranslations("Menu");
	const categories = group.categoryIds
		.map((id) => menu.find((c) => c.id === id))
		.filter((c): c is MenuCategory => c !== undefined);
	const [first, ...rest] = categories;
	if (!first) return null;

	return (
		<section
			id={group.id}
			className="flex flex-col gap-6 scroll-mt-[calc(var(--header-height)+4.5rem)]"
		>
			<h2 className="text-xl font-semibold uppercase tracking-wide">
				{t(`categories.${first.id}.title`)}
			</h2>
			{/* The first category shares the group's title, so its subcategories
			    render directly under the group heading. */}
			<CategorySubsections category={first} />
			{rest.map((category) => (
				<div key={category.id} className="flex flex-col gap-6">
					<h3 className="flex items-center gap-3 text-base font-semibold uppercase tracking-wide text-foreground/80">
						<span
							className="h-0.5 w-5 rounded-full bg-brand-accent"
							aria-hidden
						/>
						{t(`categories.${category.id}.title`)}
					</h3>
					<CategorySubsections category={category} />
				</div>
			))}
		</section>
	);
}

function CategorySubsections({ category }: { category: MenuCategory }) {
	const t = useTranslations("Menu");
	return (
		<div className="flex flex-col gap-6">
			{category.subcategories.map((sub) => (
				<div key={sub.id} className="flex flex-col gap-2">
					<h4 className="text-sm font-semibold uppercase tracking-widest text-foreground/50">
						{t(`categories.${category.id}.subcategories.${sub.id}.title`)}
					</h4>
					<ul className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-6 text-card-foreground">
						{sub.items.map((item) => (
							<MenuItemRow key={item.id} item={item} categoryId={category.id} />
						))}
					</ul>
				</div>
			))}
		</div>
	);
}
