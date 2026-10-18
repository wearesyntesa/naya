import type { ComponentProps } from "react";
import Link from "next/link";
import { CodeBlock } from "./code-block";

function Anchor({ href = "", ...props }: ComponentProps<"a">) {
  if (href.startsWith("/") || href.startsWith("#")) {
    return <Link href={href} {...props} />;
  }
  return <a href={href} target="_blank" rel="noreferrer" {...props} />;
}

function docImage(slug: string) {
  return function DocImage({ src, ...props }: ComponentProps<"img">) {
    let url = typeof src === "string" ? src : "";
    if (url && !/^([a-z][a-z0-9+.-]*:|\/\/|\/)/i.test(url)) {
      const file = url.split(/[?#]/)[0].split("/").pop() ?? "";
      url = `/api/docs-assets/${encodeURIComponent(slug)}/${encodeURIComponent(file)}`;
    }
    // eslint-disable-next-line @next/next/no-img-element
    return <img loading="lazy" alt="" {...props} src={url || undefined} />;
  };
}

export const createMdxComponents = (slug: string) => ({
  ...mdxComponents,
  img: docImage(slug),
});

export const mdxComponents = {
  a: Anchor,
  pre: CodeBlock,
  table: (props: ComponentProps<"table">) => (
    <div className="overflow-x-auto">
      <table {...props} />
    </div>
  ),
  img: (props: ComponentProps<"img">) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img loading="lazy" alt="" {...props} />
  ),
};
