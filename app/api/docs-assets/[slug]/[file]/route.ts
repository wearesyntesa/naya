import { auth } from "@/auth";
import { canView } from "@/lib/access";
import { reader } from "@/lib/reader";

const TYPES: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  gif: "image/gif",
  webp: "image/webp",
  avif: "image/avif",
  svg: "image/svg+xml",
};

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string; file: string }> },
) {
  const { slug, file } = await params;
  if (!/^[\w.-]+$/.test(slug) || !/^[\w.-]+$/.test(file) || file.includes("..")) {
    return new Response("Not found", { status: 404 });
  }

  const [session, doc] = await Promise.all([
    auth(),
    reader.collections.docs.read(slug),
  ]);
  if (!doc || !canView(doc.visibility, session)) {
    return new Response("Not found", { status: 404 });
  }

  const res = await fetch(
    `https://api.github.com/repos/wearesyntesa/naya-storage/contents/src/content/docs/${slug}/content/${file}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.NAYA_STORAGE_READ_TOKEN}`,
        Accept: "application/vnd.github.raw+json",
      },
    },
  );
  if (!res.ok) return new Response("Not found", { status: 404 });

  const ext = file.split(".").pop()?.toLowerCase() ?? "";
  const type = TYPES[ext];
  if (!type) return new Response("Not found", { status: 404 });

  return new Response(res.body, {
    headers: {
      "Content-Type": type,
      "Cache-Control":
        doc.visibility === "external"
          ? "public, max-age=300"
          : "private, max-age=300",
      "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'",
    },
  });
}
