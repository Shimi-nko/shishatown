"use client";

import { Menu } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { LanguageSwitcher } from "@/components/language-switcher";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { menu } from "@/data/menu";
import { Link } from "@/i18n/navigation";

const topNav = [
	{ key: "about", href: "/#about" },
	{ key: "gallery", href: "/#gallery" },
	{ key: "contact", href: "/#contact" },
] as const;

export function MobileNav() {
	const t = useTranslations("Landing.nav");
	const tMenu = useTranslations("Menu");
	const [open, setOpen] = useState(false);
	const close = () => setOpen(false);

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger
				render={
					<Button
						variant="outline"
						size="icon"
						aria-label="Open menu"
						className="md:hidden"
					>
						<Menu className="size-5" />
					</Button>
				}
			/>
			<SheetContent side="right" className="flex flex-col gap-6 pt-12">
				<SheetTitle className="sr-only">Shisha Town</SheetTitle>
				<nav className="flex flex-col gap-1 px-4">
					<Link
						href="/#about"
						onClick={close}
						className="rounded-md px-3 py-3 text-lg font-medium hover:bg-muted"
					>
						{t("about")}
					</Link>
					<div className="flex flex-col gap-1">
						<Link
							href="/menu"
							onClick={close}
							className="rounded-md px-3 py-3 text-lg font-medium hover:bg-muted"
						>
							{t("menu")}
						</Link>
						<div className="ml-3 flex flex-col gap-1 border-l border-border pl-3">
							{menu.map((category) => (
								<Link
									key={category.id}
									href={`/menu/${category.slug}`}
									onClick={close}
									className="rounded-md px-3 py-2 text-base text-foreground/80 hover:bg-muted"
								>
									{tMenu(`categories.${category.id}.title`)}
								</Link>
							))}
						</div>
					</div>
					{topNav
						.filter((n) => n.key !== "about")
						.map(({ key, href }) => (
							<Link
								key={key}
								href={href}
								onClick={close}
								className="rounded-md px-3 py-3 text-lg font-medium hover:bg-muted"
							>
								{t(key)}
							</Link>
						))}
				</nav>
				<div className="mt-auto flex items-center gap-3 px-4 pb-6">
					<LanguageSwitcher />
					<ModeToggle />
				</div>
			</SheetContent>
		</Sheet>
	);
}
