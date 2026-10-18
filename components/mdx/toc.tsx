"use client";

import { useEffect, useState } from "react";
import type { TocItem } from "@/lib/mdx";
import { cn } from "@/lib/utils";

const OFFSET = 96;

export function Toc({ items }: Readonly<{ items: TocItem[] }>) {
  const [activeId, setActiveId] = useState<string | null>(items[0]?.id ?? null);

  useEffect(() => {
    if (items.length === 0) return;
    let frame = 0;

    const update = () => {
      frame = 0;
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2;
      let current = items[0].id;
      if (atBottom) {
        current = items[items.length - 1].id;
      } else {
        for (const item of items) {
          const el = document.getElementById(item.id);
          if (el && el.getBoundingClientRect().top <= OFFSET) current = item.id;
        }
      }
      setActiveId(current);
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [items]);

  if (items.length === 0) return null;
  return (
    <nav
      aria-label="On this page"
      className="sticky top-20 hidden h-fit w-56 shrink-0 text-sm xl:block"
    >
      <p className="mb-2 font-medium">On this page</p>
      <ul className="space-y-1.5 border-l">
        {items.map((item) => {
          const active = item.id === activeId;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={active ? "location" : undefined}
                className={cn(
                  "-ml-px block border-l transition-colors",
                  active
                    ? "border-foreground font-medium text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground",
                  item.depth === 3 ? "pl-6" : "pl-3",
                )}
              >
                {item.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
