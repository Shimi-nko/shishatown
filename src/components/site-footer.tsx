import { Mail, MapPin, Phone } from "lucide-react";
import { useTranslations } from "next-intl";

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
					<div className="border-t border-white/20 pt-6 text-sm text-white/60">
						{t("rights")}
					</div>
				</div>
			</div>
		</footer>
	);
}
