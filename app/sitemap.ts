import type { MetadataRoute } from "next";
import { menu } from "@/data/menu";
import { routing } from "@/i18n/routing";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

function entry(path: string): MetadataRoute.Sitemap[number] {
	const url = `${baseUrl}${path}`;
	const languages = Object.fromEntries(
		routing.locales.map((l) => [l, url]),
	) as Record<string, string>;
	return {
		url,
		lastModified: new Date(),
		alternates: { languages },
	};
}

export default function sitemap(): MetadataRoute.Sitemap {
	const paths = ["/", "/menu", ...menu.map((c) => `/menu/${c.slug}`)];
	return paths.map(entry);
}
