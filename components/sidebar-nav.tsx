"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronRight,
  FileText,
  Folder,
  FolderOpen,
  Menu,
  Search,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";
import { Badge } from "./ui/badge";
import { UserMenu } from "./user-menu";
import type { MenuUser } from "@/lib/session-user";

export type SidebarDoc = {
  slug: string;
  title: string;
  visibility: "internal" | "external";
};

const GROUP_LABELS = {
  internal: "Members only",
  external: "Public",
} as const;

export function SidebarNav({
  docs,
  user,
}: Readonly<{ docs: SidebarDoc[]; user: MenuUser | null }>) {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [query, setQuery] = useState("");
  const modKey = useSyncExternalStore(
    () => () => {},
    () => (/Mac|iPhone|iPad/.test(navigator.platform) ? "⌘" : "Ctrl"),
    () => "Ctrl",
  );
  const searchRef = useRef<HTMLInputElement>(null);
  const [closedGroups, setClosedGroups] = useState<Record<string, boolean>>({});
  const searching = query.trim() !== "";

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchRef.current?.focus();
        searchRef.current?.select();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    const matches = q
      ? docs.filter((d) => d.title.toLowerCase().includes(q))
      : docs;
    const kinds = new Set(docs.map((d) => d.visibility));
    const labelled = kinds.size > 1;
    return (["internal", "external"] as const)
      .map((v) => ({
        key: v,
        label: labelled ? GROUP_LABELS[v] : null,
        items: matches.filter((d) => d.visibility === v),
      }))
      .filter((g) => g.items.length > 0);
  }, [docs, query]);

  const isOpen = (key: string) => searching || !closedGroups[key];
  const toggleGroup = (key: string) =>
    setClosedGroups((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-30 flex h-12 items-center gap-2 border-b bg-background/80 px-3 backdrop-blur md:hidden">
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          aria-label="Open docs navigation"
          className="inline-flex size-9 items-center justify-center rounded-md hover:bg-neutral-900/5 focus-visible:outline-2 focus-visible:outline-neutral-500 dark:hover:bg-white/5"
        >
          <Menu className="size-4" />
        </button>
        <Link
          href="/"
          className="text-sm font-semibold uppercase text-gray-900 dark:text-neutral-100"
        >
          Naya
        </Link>
        <div className="ml-auto">
          <UserMenu user={user} showTheme />
        </div>
      </header>

      {drawerOpen && (
        <button
          type="button"
          aria-label="Close docs navigation"
          onClick={() => setDrawerOpen(false)}
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
        />
      )}

      <aside
        aria-label="Documentation"
        className={cn(
          "z-40 flex shrink-0 flex-col overflow-hidden border-r bg-white/70 backdrop-blur-md dark:bg-neutral-950/70",
          "motion-safe:transition-[translate] motion-safe:duration-300 motion-safe:ease-[cubic-bezier(0.32,0.72,0,1)]",
          "fixed inset-y-0 left-0 w-72 pt-14",
          drawerOpen ? "translate-x-0" : "-translate-x-full",
          "md:sticky md:top-0 md:bottom-auto md:h-dvh md:translate-x-0 md:w-68 md:self-start md:pt-0",
        )}
      >
        <div className="flex h-14 shrink-0 items-center justify-between border-b px-1.5">
          <Link
            href="/"
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              // px-4 puts the wordmark on the same left edge as the doc icons below (6 + 16 = 22px).
              "h-8 px-4 text-sm font-semibold uppercase text-gray-900 dark:text-neutral-100",
            )}
          >
            Naya
          </Link>
        </div>
        <div className="flex h-12 items-center gap-1 px-1.5">
          <label className="relative flex h-8 min-w-0 flex-1 items-center">
            <Search className="pointer-events-none absolute left-2.5 size-3.5 text-muted-foreground" />
            <input
              ref={searchRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Find a doc"
              aria-label="Find a doc"
              aria-keyshortcuts="Control+K Meta+K"
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  setQuery("");
                  e.currentTarget.blur();
                }
              }}
              className="h-8 w-full rounded-md bg-neutral-900/5 pl-8 pr-12 text-[13px] placeholder:text-muted-foreground focus-visible:outline-2 focus-visible:outline-neutral-500 dark:bg-white/5"
            />
            {!query && (
              <kbd
                aria-hidden
                className="pointer-events-none absolute right-2 hidden h-5 items-center rounded border bg-background/60 px-1.5 font-sans text-[11px] text-muted-foreground md:inline-flex"
              >
                {modKey} K
              </kbd>
            )}
          </label>

          <button
            type="button"
            onClick={() => setDrawerOpen(false)}
            aria-label="Close docs navigation"
            className="ml-auto inline-flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-neutral-900/5 md:hidden"
          >
            <X className="size-4" />
          </button>
        </div>

        <nav className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden pb-4">
          {docs.length === 0 && (
            <p className="px-4 py-3 text-[13px] text-muted-foreground">
              No docs yet. Add one from the dashboard.
            </p>
          )}

          {docs.length > 0 && groups.length === 0 && (
            <p className="px-4 py-3 text-[13px] text-muted-foreground">
              No docs match “{query}”.{" "}
              <button
                type="button"
                onClick={() => setQuery("")}
                className="underline underline-offset-2 hover:text-foreground"
              >
                Clear search
              </button>
            </p>
          )}

          {groups.map((group, i) => (
            <section key={group.key} className={cn(i > 0 && "mt-1")}>
              {group.label && (
                <h2>
                  <button
                    type="button"
                    onClick={() => toggleGroup(group.key)}
                    aria-expanded={isOpen(group.key)}
                    aria-controls={`sidebar-group-${group.key}`}
                    className="mx-1.5 flex h-8 w-[calc(100%-0.75rem)] items-center gap-2 rounded-md px-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-neutral-900/5 hover:text-foreground focus-visible:outline-2 focus-visible:outline-neutral-500 dark:hover:bg-white/5"
                  >
                    <ChevronRight
                      className={cn(
                        "size-3.5 shrink-0 motion-safe:transition-transform motion-safe:duration-200",
                        isOpen(group.key) && "rotate-90",
                      )}
                    />
                    {isOpen(group.key) ? (
                      <FolderOpen className="size-4 shrink-0" />
                    ) : (
                      <Folder className="size-4 shrink-0" />
                    )}
                    <span className="truncate">{group.label}</span>
                    <Badge className="ml-auto tabular-nums *:text-xs text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-950">
                      {group.items.length}
                    </Badge>
                  </button>
                </h2>
              )}
              <div
                id={`sidebar-group-${group.key}`}
                className={cn(
                  "grid motion-safe:transition-[grid-template-rows,visibility] motion-safe:duration-200",
                  isOpen(group.key)
                    ? "grid-rows-[1fr]"
                    : "invisible grid-rows-[0fr]",
                )}
              >
                <ul className="flex min-h-0 flex-col gap-0.5 overflow-hidden">
                  {group.items.map((doc) => {
                    const href = `/docs/${doc.slug}`;
                    const active = pathname === href;
                    return (
                      <li key={doc.slug} className="relative">
                        {active && (
                          <span
                            aria-hidden
                            className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r-full bg-neutral-900 dark:bg-neutral-100"
                          />
                        )}
                        <Link
                          href={href}
                          onClick={() => setDrawerOpen(false)}
                          aria-current={active ? "page" : undefined}
                          aria-label={doc.title}
                          title={doc.title}
                          className={cn(
                            "mx-1.5 flex h-10 items-center gap-3 rounded-md px-1.5 text-[13px] transition-colors focus-visible:outline-2 focus-visible:outline-neutral-500",
                            active
                              ? "bg-neutral-900/8 font-medium text-neutral-950 dark:bg-white/10 dark:text-neutral-50"
                              : "text-neutral-600 hover:bg-neutral-900/5 hover:text-neutral-950 dark:text-neutral-400 dark:hover:bg-white/5 dark:hover:text-neutral-50",
                          )}
                        >
                          <FileText
                            aria-hidden
                            className="mx-2.5 size-4 shrink-0"
                          />
                          <span className="truncate">{doc.title}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </section>
          ))}
        </nav>

        <div className="shrink-0 border-t p-1.5">
          <UserMenu user={user} variant="row" showTheme />
        </div>
      </aside>
    </>
  );
}
