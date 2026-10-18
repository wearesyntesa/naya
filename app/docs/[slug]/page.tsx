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

type Params = Promise<{ slug: string }>;

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
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Docs</h1>
        <p className="text-neutral-500">
          You must be a Syntesa member to access the docs.
        </p>
      </div>
    );
  }

  let rendered;
  try {
    rendered = await renderMdx(await doc.content(), slug);
  } catch (error) {
    console.error(`Failed to render doc "${slug}":`, error);
    return (
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">{doc.title}</h1>
        <p className="text-neutral-500">This doc failed to render.</p>
      </div>
    );
  }

  return (
    <div className="flex gap-10">
      <ReadingProgress />
      <BackToTop />
      <article className="prose prose-neutral dark:prose-invert min-w-0 max-w-3xl flex-1">
        <h1>{doc.title}</h1>
        {rendered.content}
      </article>
      <Toc items={rendered.toc} />
    </div>
  );
}
