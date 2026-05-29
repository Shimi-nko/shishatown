"use client";

import { Check, Languages } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

type Locale = (typeof routing.locales)[number];

const LOCALES: Record<Locale, string> = {
	sk: "SK",
	en: "EN",
	de: "DE",
	ru: "RU",
	uk: "UK",
};

export function LanguageSwitcher() {
	const locale = useLocale() as Locale;
	const t = useTranslations("Languages");
	const router = useRouter();
	const pathname = usePathname();
	const [isPending, startTransition] = useTransition();

	const change = (loc: Locale) => {
		if (loc === locale) return;
		startTransition(() => {
			router.replace(pathname, { locale: loc });
		});
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				render={
					<Button
						variant="outline"
						aria-busy={isPending}
						aria-label="Change language"
						className="gap-2"
					>
						<Languages className="size-4" />
						<span className="font-medium">{LOCALES[locale]}</span>
					</Button>
				}
			/>
			<DropdownMenuContent align="end" className="min-w-[10rem]">
				{routing.locales.map((loc) => {
					const active = loc === locale;
					return (
						<DropdownMenuItem
							key={loc}
							onClick={() => change(loc)}
							className="justify-between"
						>
							<span>{t(loc)}</span>
							{active && <Check className="size-4" />}
						</DropdownMenuItem>
					);
				})}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
