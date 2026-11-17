import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { auth } from "@/auth";
import { canView } from "@/lib/access";
import { reader } from "@/lib/reader";
import { buttonVariants } from "@/components/ui/button";
import { ChapterTag } from "@/components/ui/chapter-tag";

export const metadata: Metadata = { title: "Docs" };

const visibilityLabel = {
  internal: "Internal",
  external: "External",
} as const;

type DocEntry = {
  slug: string;
  title: string;
  visibility: keyof typeof visibilityLabel;
};

const byTitle = (a: DocEntry, b: DocEntry) => a.title.localeCompare(b.title);

const DocCell = ({ slug, title, visibility }: DocEntry) => (
  <Link
    href={`/docs/${slug}`}
    className="group flex min-h-40 flex-col justify-between gap-8 bg-(--canvas) p-6 -outline-offset-2 transition-colors duration-300 ease-[cubic-bezier(.2,0,0,1)] hover:bg-(--chapter) focus-visible:outline-2 focus-visible:outline-(--blue)"
  >
    <div className="flex items-start justify-between gap-4">
      <span className="text-[12px] leading-4 font-medium text-(--support)">
        {visibilityLabel[visibility]}
      </span>
      <ArrowUpRight
        aria-hidden
        size={16}
        strokeWidth={1.25}
        className="text-(--support) transition-colors duration-300 group-hover:text-(--ink)"
      />
    </div>
    <h2 className="text-[18px] leading-6 font-medium tracking-[-0.01em] text-(--ink)">
      {title}
    </h2>
  </Link>
);

const EmptyState = () => (
  <div className="flex flex-col items-start gap-5 border-t border-(--rule) px-6 py-16">
    <p className="max-w-md text-[18px] leading-[1.3] font-medium tracking-[-0.01em] text-(--support)">
      No docs yet. Open the editor to write the first one.
    </p>
    <Link
      href="/keystatic"
      target="_blank"
      rel="noopener noreferrer"
      className={buttonVariants()}
    >
      Open editor
    </Link>
  </div>
);

export default async function DocsPage() {
  const [session, all] = await Promise.all([
    auth(),
    reader.collections.docs.all(),
  ]);

  const docs: ReadonlyArray<DocEntry> = all
    .filter(({ entry }) => canView(entry.visibility, session))
    .map(({ slug, entry }) => ({
      slug,
      title: entry.title || slug,
      visibility: entry.visibility,
    }))
    .sort(byTitle);

  return (
    <div className="mx-auto w-full max-w-5xl">
      <ChapterTag>Documentation</ChapterTag>
      <div className="mt-16">
        {docs.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid gap-px border-y border-(--rule) bg-(--rule) sm:grid-cols-2 lg:grid-cols-3">
            {docs.map((doc) => (
              <DocCell key={doc.slug} {...doc} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
