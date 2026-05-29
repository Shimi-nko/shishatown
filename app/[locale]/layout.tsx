import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { ReactNode } from "react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ThemeProvider } from "@/components/theme-provider";
import { routing } from "@/i18n/routing";
import "../globals.css";

export function generateStaticParams() {
	return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string }>;
}): Promise<Metadata> {
	const { locale } = await params;
	if (!hasLocale(routing.locales, locale)) {
		return {};
	}
	const t = await getTranslations({ locale, namespace: "Metadata" });
	const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
	const languages = Object.fromEntries(
		routing.locales.map((l) => [l, `${baseUrl}/`]),
	);
	return {
		metadataBase: new URL(baseUrl),
		title: t("title"),
		description: t("description"),
		keywords: t("keywords"),
		icons: { icon: "/assets/favicon.png" },
		alternates: {
			canonical: "/",
			languages: {
				...languages,
				"x-default": `${baseUrl}/`,
			},
		},
		// robots: {
		// 	index: true,
		// 	follow: true,
		// },
		robots: {
			index: false,
			follow: false,
		},
		openGraph: {
			title: t("title"),
			description: t("description"),
			siteName: t("siteName"),
			locale: t("ogLocale"),
			type: "website",
			images: ["/assets/main_background.jpg"],
		},
		twitter: {
			card: "summary_large_image",
			title: t("title"),
			description: t("description"),
			images: ["/assets/main_background.jpg"],
		},
	};
}

function LocalBusinessJsonLd() {
	const data = {
		"@context": "https://schema.org",
		"@type": "BarOrPub",
		name: "Shisha Town Bratislava",
		url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
		telephone: "+421948455534",
		email: "info@shishatown.sk",
		address: {
			"@type": "PostalAddress",
			streetAddress: "Mickiewiczova 5",
			postalCode: "811 07",
			addressLocality: "Bratislava",
			addressCountry: "SK",
		},
		openingHoursSpecification: [
			{
				"@type": "OpeningHoursSpecification",
				dayOfWeek: [
					"Monday",
					"Tuesday",
					"Wednesday",
					"Thursday",
					"Friday",
					"Saturday",
				],
				opens: "15:00",
				closes: "23:00",
			},
			{
				"@type": "OpeningHoursSpecification",
				dayOfWeek: "Sunday",
				opens: "17:00",
				closes: "23:00",
			},
		],
	};
	return (
		<script
			type="application/ld+json"
			// biome-ignore lint/security/noDangerouslySetInnerHtml: schema.org payload
			dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
		/>
	);
}

export default async function RootLayout({
	children,
	params,
}: {
	children: ReactNode;
	params: Promise<{ locale: string }>;
}) {
	const { locale } = await params;
	if (!hasLocale(routing.locales, locale)) {
		notFound();
	}
	setRequestLocale(locale);
	const tA11y = await getTranslations({ locale, namespace: "A11y" });
	const skipLabel = tA11y("skipToContent");

	return (
		<html lang={locale} className="h-full antialiased" suppressHydrationWarning>
			<body className="min-h-full flex flex-col">
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<NextIntlClientProvider>
						<a
							href="#main"
							className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-foreground focus:px-3 focus:py-2 focus:text-background focus:outline-2 focus:outline-offset-2 focus:outline-brand-accent"
						>
							{skipLabel}
						</a>
						<SiteHeader />
						<main
							id="main"
							className="flex flex-1 flex-col bg-background text-foreground"
						>
							{children}
						</main>
						<SiteFooter />
						<LocalBusinessJsonLd />
					</NextIntlClientProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
