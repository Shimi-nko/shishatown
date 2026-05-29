import { useFormatter, useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { menu } from "@/data/menu";

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
					<MenuCategory key={category.id} category={category} />
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

function MenuCategory({ category }: { category: (typeof menu)[number] }) {
	const t = useTranslations("Menu");
	const format = useFormatter();
	const currency = t("currency");

	return (
		<section className="flex flex-col gap-4">
			<h2 className="text-xl font-semibold uppercase tracking-wide">
				{t(`categories.${category.id}.title`)}
			</h2>
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
								{format.number(item.price, {
									style: "currency",
									currency,
								})}
							</span>
						</li>
					);
				})}
			</ul>
		</section>
	);
}
