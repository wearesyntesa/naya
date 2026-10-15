import { auth } from "@/auth";
import { canView } from "@/lib/access";
import { reader } from "@/lib/reader";
import { notFound } from "next/navigation";

type Params = Promise<{ slug: string }>;

export default async function DocPage({
  params,
}: Readonly<{
  params: Params;
}>) {
  const session = await auth();
  const { slug } = await params;
  const doc = await reader.collections.docs.read(slug);

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

  return (
    <div>
      {doc.title} - {doc.visibility}
    </div>
  );
}
