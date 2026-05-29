import { ChevronDown } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import logoImage from "@/assets/logo.png";
import { LanguageSwitcher } from "@/components/language-switcher";
import { MobileNav } from "@/components/mobile-nav";
import { ModeToggle } from "@/components/mode-toggle";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { menu } from "@/data/menu";
import { Link } from "@/i18n/navigation";

const topNav = [
	{ key: "about", href: "/#about" },
	{ key: "gallery", href: "/#gallery" },
	{ key: "contact", href: "/#contact" },
] as const;

function Logo() {
	return (
		<Link href="/">
			<Image
				src={logoImage}
				alt="Shisha Town"
				height={40}
				priority
				placeholder="blur"
				className="h-10 w-auto dark:invert"
			/>
		</Link>
	);
}

function MenuDropdown() {
	const t = useTranslations("Landing.nav");
	const tMenu = useTranslations("Menu");
	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				render={
					<button
						type="button"
						className="inline-flex items-center gap-1 hover:underline"
					>
						{t("menu")}
						<ChevronDown className="size-4" />
					</button>
				}
			/>
			<DropdownMenuContent align="start" className="min-w-[12rem]">
				<DropdownMenuItem
					render={<Link href="/menu">{tMenu("pageTitle")}</Link>}
				/>
				<DropdownMenuSeparator />
				{menu.map((category) => (
					<DropdownMenuItem
						key={category.id}
						render={
							<Link href={`/menu/${category.slug}`}>
								{tMenu(`categories.${category.id}.title`)}
							</Link>
						}
					/>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

export function SiteHeader() {
	const t = useTranslations("Landing.nav");
	return (
		<header className="sticky top-0 z-40 border-b border-border/40 bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="flex items-center justify-between px-6 py-4 md:px-16 md:py-6">
				<Logo />
				<nav className="hidden items-center gap-6 text-base md:flex">
					<Link href="/#about" className="hover:underline">
						{t("about")}
					</Link>
					<MenuDropdown />
					{topNav
						.filter((n) => n.key !== "about")
						.map(({ key, href }) => (
							<Link key={key} href={href} className="hover:underline">
								{t(key)}
							</Link>
						))}
					<LanguageSwitcher />
					<ModeToggle />
				</nav>
				<MobileNav />
			</div>
		</header>
	);
}
