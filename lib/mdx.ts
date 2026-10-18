import "server-only";
import { cache, type ReactElement } from "react";
import { compileMDX } from "next-mdx-remote/rsc";
import GithubSlugger from "github-slugger";
import { visit } from "unist-util-visit";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import { createMdxComponents } from "@/components/mdx/mdx-components";

export type TocItem = { depth: 2 | 3; text: string; id: string };

type MdNode = { type: string; value?: string; children?: MdNode[] };
type MdHeading = MdNode & { depth: number };

function nodeText(node: MdNode): string {
  if (typeof node.value === "string") return node.value;
  return node.children?.map(nodeText).join("") ?? "";
}

function remarkToc(toc: TocItem[]) {
  return () => (tree: MdNode) => {
    const slugger = new GithubSlugger();
    visit(tree as Parameters<typeof visit>[0], "heading", (node) => {
      const heading = node as unknown as MdHeading;
      const text = nodeText(heading);
      const id = slugger.slug(text);
      if (heading.depth === 2 || heading.depth === 3) {
        toc.push({ depth: heading.depth, text, id });
      }
    });
  };
}

export const renderMdx = cache(
  async (
    source: string,
    slug: string,
  ): Promise<{ content: ReactElement; toc: TocItem[] }> => {
    const toc: TocItem[] = [];

    const { content } = await compileMDX({
      source,
      components: createMdxComponents(slug),
      options: {
        parseFrontmatter: false,
        blockJS: true,
        mdxOptions: {
          remarkPlugins: [remarkGfm, remarkToc(toc)],
          rehypePlugins: [
            rehypeSlug,
            [rehypeAutolinkHeadings, { behavior: "wrap" }],
            [
              rehypePrettyCode,
              {
                theme: { light: "github-light", dark: "github-dark" },
                keepBackground: false,
              },
            ],
          ],
        },
      },
    });

    return { content, toc };
  },
);
