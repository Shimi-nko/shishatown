import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
	locales: ["sk", "en", "de", "ru", "uk"],
	defaultLocale: "sk",
	localePrefix: "never",
});
