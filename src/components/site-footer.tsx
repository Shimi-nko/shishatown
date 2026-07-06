import { Mail, MapPin, Phone } from "lucide-react";
import { useTranslations } from "next-intl";

// lucide-react v1 removed brand icons — classic lucide glyphs inlined.
function FacebookIcon({ className }: { className?: string }) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			className={className}
			aria-hidden
		>
			<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
		</svg>
	);
}

function InstagramIcon({ className }: { className?: string }) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			className={className}
			aria-hidden
		>
			<rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
			<path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
			<line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
		</svg>
	);
}

export function SiteFooter() {
	const t = useTranslations("Landing.footer");
	const tHours = useTranslations("Landing.hours");
	return (
		<footer className="mt-16 px-6 md:px-16">
			<div className="rounded-t-3xl bg-brand-ink p-8 text-white md:p-16">
				<div className="flex flex-col gap-10">
					<div className="flex items-center gap-2 text-xl font-semibold">
						<span
							className="inline-block size-6 rounded-full bg-brand-accent"
							aria-hidden
						/>
						<span>Shisha Town</span>
					</div>
					<div className="grid gap-8 md:grid-cols-2">
						<div className="flex flex-col gap-3">
							<span className="self-start rounded-md bg-brand-accent px-3 py-1 text-base font-medium text-brand-accent-foreground">
								{t("contactTitle")}
							</span>
							<ul className="flex flex-col gap-2 text-sm text-white/80">
								<li className="flex items-start gap-2">
									<MapPin className="mt-0.5 size-4 shrink-0" aria-hidden />
									<span>{t("address")}</span>
								</li>
								<li>
									<a
										href="tel:+421948455534"
										className="flex items-center gap-2 hover:underline"
									>
										<Phone className="size-4 shrink-0" aria-hidden />
										<span>{t("phone")}</span>
									</a>
								</li>
								<li>
									<a
										href="mailto:info@shishatown.sk"
										className="flex items-center gap-2 hover:underline"
									>
										<Mail className="size-4 shrink-0" aria-hidden />
										<span>{t("email")}</span>
									</a>
								</li>
							</ul>
						</div>
						<div className="flex flex-col gap-3">
							<span className="self-start rounded-md bg-brand-accent px-3 py-1 text-base font-medium text-brand-accent-foreground">
								{t("hoursTitle")}
							</span>
							<ul className="flex flex-col gap-2 text-sm text-white/80">
								<li>
									{tHours("weekdays")}: {tHours("weekdaysTime")}
								</li>
								<li>
									{tHours("sunday")}: {tHours("sundayTime")}
								</li>
							</ul>
						</div>
					</div>
					<div className="flex flex-col gap-4 border-t border-white/20 pt-6 sm:flex-row sm:items-center sm:justify-between">
						<span className="text-sm text-white/60">{t("rights")}</span>
						<div className="flex items-center gap-3">
							<a
								href="https://www.facebook.com/shishatownbratislava"
								target="_blank"
								rel="noopener noreferrer"
								aria-label="Facebook"
								className="grid size-9 place-items-center rounded-full border border-white/20 text-white/80 transition-colors hover:border-brand-accent hover:bg-brand-accent hover:text-brand-accent-foreground"
							>
								<FacebookIcon className="size-4" />
							</a>
							<a
								href="https://www.instagram.com/townshisha"
								target="_blank"
								rel="noopener noreferrer"
								aria-label="Instagram"
								className="grid size-9 place-items-center rounded-full border border-white/20 text-white/80 transition-colors hover:border-brand-accent hover:bg-brand-accent hover:text-brand-accent-foreground"
							>
								<InstagramIcon className="size-4" />
							</a>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
}
