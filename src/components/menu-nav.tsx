"use client";

import { useEffect, useState } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

type MenuNavProps = {
	sections: { id: string; label: string }[];
};

export function MenuNav({ sections }: MenuNavProps) {
	const [activeId, setActiveId] = useState(sections[0]?.id);

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				const visible = entries
					.filter((entry) => entry.isIntersecting)
					.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
				if (visible[0]) {
					setActiveId(visible[0].target.id);
				}
			},
			// Track the band just below the sticky bar so the section under it wins.
			{ rootMargin: "-15% 0px -70% 0px" },
		);
		for (const { id } of sections) {
			const el = document.getElementById(id);
			if (el) observer.observe(el);
		}
		return () => observer.disconnect();
	}, [sections]);

	return (
		<nav
			aria-label="Menu categories"
			className="sticky top-0 z-20 -mx-6 border-b border-border/60 bg-background/90 backdrop-blur-sm md:-mx-16"
		>
			<ScrollArea className="w-full">
				<div className="flex gap-2 px-6 py-3 md:px-16">
					{sections.map(({ id, label }) => (
						<a
							key={id}
							href={`#${id}`}
							aria-current={activeId === id ? "true" : undefined}
							className={cn(
								"whitespace-nowrap rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
								activeId === id
									? "border-brand-accent bg-brand-accent text-brand-accent-foreground"
									: "border-border text-foreground/70 hover:border-foreground/30 hover:text-foreground",
							)}
						>
							{label}
						</a>
					))}
				</div>
				<ScrollBar orientation="horizontal" className="invisible" />
			</ScrollArea>
		</nav>
	);
}
