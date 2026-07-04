import { useFormatter, useTranslations } from "next-intl";
import type { MenuItem, MenuItemPrice } from "@/data/menu";

export function MenuItemRow({
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
	const fmt = (n: number) => format.number(n, { style: "currency", currency });

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
