import { cache } from "react";
import type { Metadata } from "next";
import { auth } from "@/auth";
import { canView } from "@/lib/access";
import { reader } from "@/lib/reader";
import { renderMdx } from "@/lib/mdx";
import { Toc } from "@/components/mdx/toc";
import { BackToTop } from "@/components/mdx/back-to-top";
import { ReadingProgress } from "@/components/mdx/reading-progress";
import { notFound } from "next/navigation";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ChapterTag } from "@/components/ui/chapter-tag";

type Params = Promise<{ slug: string }>;

const visibilityLabel = {
  internal: "Internal",
  external: "External",
} as const;

const proseStyles =
  "prose prose-neutral min-w-0 max-w-3xl flex-1 prose-headings:font-medium prose-headings:tracking-[-0.01em] prose-headings:text-(--ink) prose-p:text-(--sec-ink) prose-li:text-(--sec-ink) prose-strong:text-(--ink) prose-a:font-medium prose-a:text-(--label) prose-a:underline-offset-4 prose-blockquote:border-(--rule) prose-blockquote:text-(--support) prose-hr:border-(--rule) prose-th:text-(--ink) prose-td:border-(--rule)";

const Notice = ({
  title,
  body,
  action,
}: Readonly<{
  title: string;
  body: string;
  action?: Readonly<{ href: string; label: string }>;
}>) => (
  <div className="mx-auto flex max-w-md flex-col items-start gap-3 border-y border-(--rule) py-16">
    <h1 className="text-[28px] leading-[1.1] font-medium tracking-[-0.01em] text-(--ink)">
      {title}
    </h1>
    <p className="text-[16px] leading-[22px] font-medium tracking-[-0.01em] text-(--support)">
      {body}
    </p>
    {action && (
      <Link
        href={action.href}
        className={`mt-3 ${buttonVariants({ variant: "outline" })}`}
      >
        {action.label}
      </Link>
    )}
  </div>
);

const getDoc = cache((slug: string) => reader.collections.docs.read(slug));

export async function generateMetadata({
  params,
}: Readonly<{ params: Params }>): Promise<Metadata> {
  const { slug } = await params;
  const [session, doc] = await Promise.all([auth(), getDoc(slug)]);

  if (!doc || !canView(doc.visibility, session)) {
    return { title: "Docs" };
  }
  return { title: doc.title };
}

export default async function DocPage({
  params,
}: Readonly<{
  params: Params;
}>) {
  const session = await auth();
  const { slug } = await params;
  const doc = await getDoc(slug);

  if (!doc) {
    return notFound();
  }

  if (!canView(doc.visibility, session)) {
    return (
      <Notice
        title="This doc is for Syntesa members"
        body="Log in with your Syntesa account to read it."
        action={{ href: "/api/auth/signin", label: "Log in" }}
      />
    );
  }

  let rendered;
  try {
    rendered = await renderMdx(await doc.content(), slug);
  } catch (error) {
    console.error(`Failed to render doc "${slug}":`, error);
    return (
      <Notice
        title={doc.title}
        body="This doc couldn't be displayed. Check its MDX in the editor, then reload."
        action={{ href: "/keystatic", label: "Open editor" }}
      />
    );
  }

  return (
    <div className="flex gap-10">
      <ReadingProgress />
      <BackToTop />
      <div className="min-w-0 max-w-3xl flex-1">
        <header className="mb-10 border-b border-(--rule) pb-8">
          <ChapterTag>{visibilityLabel[doc.visibility]}</ChapterTag>
          <h1 className="mt-6 text-[32px] leading-[1.1] font-semibold tracking-[-0.015em] text-(--ink) sm:text-[40px]">
            {doc.title}
          </h1>
        </header>
        <article className={proseStyles}>{rendered.content}</article>
      </div>
      <Toc items={rendered.toc} />
    </div>
  );
}
