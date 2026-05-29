import {
	Armchair,
	BadgeCheck,
	CalendarCheck,
	FlaskConical,
	Headphones,
	Home as HomeIcon,
	Star,
} from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import heroImage from "@/assets/main_background.jpg";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@/i18n/navigation";

type Props = {
	params: Promise<{ locale: string }>;
};

const services = [
	{ key: "house", icon: HomeIcon, tone: "card" },
	{ key: "premium", icon: Star, tone: "accent" },
	{ key: "experimental", icon: FlaskConical, tone: "card" },
] as const;

const features = [
	{ key: "quality", icon: BadgeCheck },
	{ key: "vibe", icon: Headphones },
	{ key: "limited", icon: Armchair },
	{ key: "reservation", icon: CalendarCheck },
] as const;

export default async function Home({ params }: Props) {
	const { locale } = await params;
	setRequestLocale(locale);

	return (
		<>
			<Hero />
			<Hours />
			<Services />
		</>
	);
}

function Hero() {
	const t = useTranslations("Landing.hero");
	return (
		<section className="grid items-center gap-10 px-6 py-6 md:grid-cols-2 md:px-16 md:py-10">
			<div className="flex flex-col gap-8">
				<h1 className="text-4xl font-medium leading-tight tracking-tight md:text-6xl">
					{t("title")}
				</h1>
				<p className="text-xl text-foreground/90 md:text-2xl">
					{t("subtitle")}
				</p>
				<p className="max-w-lg text-base text-foreground/70">
					{t("description")}
				</p>
				<div className="flex flex-wrap gap-4">
					<Button
						className="rounded-xl bg-foreground px-8 py-7 text-base text-background hover:bg-foreground/90"
						size="lg"
						nativeButton={false}
						render={
							<a
								href="tel:+421948455534"
								aria-label={`${t("cta")} — +421 948 455 534`}
							>
								{t("cta")}
							</a>
						}
					/>
					<Button
						variant="outline"
						className="rounded-xl px-8 py-7 text-base"
						size="lg"
						nativeButton={false}
						render={<Link href="/menu">{t("secondaryCta")}</Link>}
					/>
				</div>
			</div>
			<div className="relative aspect-square w-full overflow-hidden rounded-2xl">
				<Image
					src={heroImage}
					alt="Shisha Town interior"
					fill
					placeholder="blur"
					className="object-cover"
					sizes="(min-width: 768px) 50vw, 100vw"
					priority
				/>
			</div>
		</section>
	);
}

function Hours() {
	const t = useTranslations("Landing.hours");
	return (
		<section className="px-6 md:px-16">
			<div className="flex flex-col items-start gap-4 rounded-2xl bg-muted p-6 md:flex-row md:items-center md:justify-between md:p-8">
				<span className="rounded-md bg-brand-accent px-3 py-1 text-base font-medium text-brand-accent-foreground">
					{t("title")}
				</span>
				<div className="flex flex-col gap-2 text-base md:flex-row md:gap-10">
					<span>
						<strong>{t("weekdays")}: </strong>
						{t("weekdaysTime")}
					</span>
					<span>
						<strong>{t("sunday")}: </strong>
						{t("sundayTime")}
					</span>
				</div>
			</div>
		</section>
	);
}

function Services() {
	const t = useTranslations("Landing.services");

	return (
		<section
			id="menu"
			className="flex flex-col gap-12 px-6 py-8 md:px-16 md:py-12"
		>
			<header className="flex flex-col items-start gap-4 md:flex-row md:items-center">
				<h2 className="rounded-lg bg-brand-accent px-4 py-2 text-3xl font-medium text-brand-accent-foreground md:text-4xl">
					{t("title")}
				</h2>
				<p className="max-w-xl text-base text-foreground/80">{t("subtitle")}</p>
			</header>
			<div className="grid gap-6 md:grid-cols-3">
				{services.map(({ key, icon: Icon, tone }) => (
					<ServiceCard key={key} k={key} Icon={Icon} tone={tone} />
				))}
			</div>
			<Features />
		</section>
	);
}

function Features() {
	const t = useTranslations("Landing.services.features");

	return (
		<div className="grid gap-4 md:grid-cols-4">
			{features.map(({ key, icon: Icon }) => (
				<div
					key={key}
					className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 text-card-foreground"
				>
					<div className="grid size-9 shrink-0 place-items-center rounded-md bg-brand-accent text-brand-accent-foreground">
						<Icon className="size-4" />
					</div>
					<div className="flex flex-col gap-0.5">
						<span className="text-sm font-semibold uppercase tracking-wide">
							{t(`${key}.title`)}
						</span>
						<span className="text-sm text-foreground/70">
							{t(`${key}.description`)}
						</span>
					</div>
				</div>
			))}
		</div>
	);
}

function ServiceCard({
	k,
	Icon,
	tone,
}: {
	k: (typeof services)[number]["key"];
	Icon: typeof HomeIcon;
	tone: "card" | "accent";
}) {
	const t = useTranslations("Landing.services");

	const list = t.raw(`items.${k}.list`) as string[];
	const isAccent = tone === "accent";

	return (
		<Card
			className={`rounded-2xl border-2 border-foreground p-5 shadow-[0_4px_0_0_var(--color-foreground)] ${
				isAccent
					? "bg-brand-accent text-brand-accent-foreground"
					: "bg-card text-card-foreground"
			}`}
		>
			<CardHeader className="p-0">
				<div
					className={`grid size-10 place-items-center rounded-md ${
						isAccent
							? "bg-background text-foreground"
							: "bg-brand-accent text-brand-accent-foreground"
					}`}
				>
					<Icon className="size-5" />
				</div>
				<CardTitle className="pt-3 text-lg font-semibold uppercase tracking-wide">
					{t(`items.${k}.title`)}
				</CardTitle>
				<p
					className={`pt-1 text-sm ${
						isAccent ? "text-brand-accent-foreground/80" : "text-foreground/70"
					}`}
				>
					{t(`items.${k}.description`)}
				</p>
			</CardHeader>
			<CardContent className="p-0 pt-4">
				<ul className="flex flex-col gap-1.5 text-sm">
					{list.map((item) => (
						<li key={item} className="flex items-center gap-2">
							<span
								className={`size-1.5 rounded-full ${
									isAccent ? "bg-brand-accent-foreground" : "bg-foreground"
								}`}
								aria-hidden
							/>
							{item}
						</li>
					))}
				</ul>
			</CardContent>
		</Card>
	);
}
