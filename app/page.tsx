import type { ReactNode } from "react";
import Link from "next/link";
import { ChapterTag } from "@/components/ui/chapter-tag";
import { buttonVariants } from "@/components/ui/button";
import { Check, FileText, Search } from "lucide-react";

const ribs =
  "repeating-linear-gradient(to right, rgba(255,255,255,0.55) 0px, rgba(255,255,255,0.55) 1px, transparent 1px, transparent 8px)";

const atmosphere =
  "radial-gradient(90% 80% at 50% 100%, rgba(230,236,255,0.4) 0%, rgba(188,203,255,0.4) 45%, rgba(134,160,238,0.4) 100%)";

type ActionProps = {
  href: string;
  variant: "default" | "outline";
  external?: boolean;
  children: ReactNode;
};

const Action = ({ href, variant, external = false, children }: ActionProps) => (
  <Link
    href={href}
    {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    className={buttonVariants({ variant })}
  >
    {children}
  </Link>
);

const Rails = ({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) => (
  <div className="mx-auto h-full w-full max-w-360 px-6">
    <div className={`h-full border-x border-(--rule) ${className}`}>
      {children}
    </div>
  </div>
);

const docTitles: ReadonlyArray<string> = [
  "Getting started",
  "Using a VM",
  "Lab rules",
  "Publishing guide",
];

const activeTitle = "Using a VM";

type TocEntry = { text: string; depth: 2 | 3 };

const toc: ReadonlyArray<TocEntry> = [
  { text: "Connect to your VM", depth: 2 },
  { text: "Add your key", depth: 3 },
  { text: "Copy files", depth: 2 },
  { text: "Shut down", depth: 2 },
];

const activeTocText = "Connect to your VM";

const codeLines: ReadonlyArray<{ text: string; marked: boolean }> = [
  { text: "ssh-keygen -t ed25519", marked: false },
  { text: "ssh your-username@lab-vm-01", marked: true },
];

const floatShadow =
  "shadow-[0_0_1px_1px_rgba(0,22,62,0.01),0_4px_12px_-1px_rgba(0,22,62,0.04),0_1px_3px_-1px_rgba(0,22,62,0.18)]";

const frameShadow =
  "shadow-[0_0_0_1px_rgba(11,13,24,0.06),0_1px_2px_rgba(11,13,24,0.024),0_3px_6px_rgba(11,13,24,0.03),0_8px_14px_rgba(11,13,24,0.035),0_16px_28px_rgba(11,13,24,0.04)]";

const DocRow = ({ title }: { title: string }) => (
  <li
    className={`relative flex h-9 items-center gap-2.5 rounded-lg px-2.5 text-[13px] leading-4 font-medium ${
      title === activeTitle ? "bg-(--stage) text-(--ink)" : "text-(--support)"
    }`}
  >
    {title === activeTitle && (
      <span className="absolute top-1/2 -left-3 h-5 w-0.5 -translate-y-1/2 rounded-r-full bg-(--ink)" />
    )}
    <FileText aria-hidden size={14} strokeWidth={1.25} className="shrink-0" />
    <span className="truncate">{title}</span>
  </li>
);

const TocRow = ({ text, depth }: TocEntry) => (
  <li
    className={`-ml-px border-l py-0.5 text-[13px] leading-5 ${
      depth === 3 ? "pl-6" : "pl-3"
    } ${
      text === activeTocText
        ? "border-(--ink) font-medium text-(--ink)"
        : "border-transparent text-(--support)"
    }`}
  >
    {text}
  </li>
);

const CodeLine = ({ text, marked }: { text: string; marked: boolean }) => (
  <div
    className={`px-4 py-0.5 ${
      marked ? "bg-(--wash) shadow-[inset_2px_0_0_var(--blue)]" : ""
    }`}
  >
    <span className="text-(--support)">$ </span>
    {text}
  </div>
);

const EditorStage = () => (
  <div
    role="img"
    aria-label="Naya docs page titled Using a VM, with a sidebar, the guide and a table of contents"
    className={`mx-auto mt-16 w-full max-w-270 rounded-t-2xl border border-b-0 border-(--rule) bg-(--stage) p-2 pb-0 text-left sm:p-4 sm:pb-0 ${frameShadow}`}
  >
    <div className="flex items-center gap-3 px-1 pb-3">
      <div className="flex gap-1.5">
        {[0, 1, 2].map((dot) => (
          <span key={dot} className="size-2 rounded-full bg-(--edge)" />
        ))}
      </div>
      <span className="truncate text-[12px] leading-4 font-medium text-(--support)">
        /docs/using-a-vm
      </span>
    </div>
    <div className="flex overflow-hidden rounded-t-xl border border-b-0 border-(--rule) bg-(--panel)">
      <aside className="hidden w-56 shrink-0 border-r border-(--rule) p-3 md:block">
        <div className="relative mb-3 flex h-8 items-center rounded-md bg-(--stage) pl-8 text-[13px] text-(--support)">
          <Search
            aria-hidden
            size={14}
            strokeWidth={1.25}
            className="absolute left-2.5"
          />
          Find a doc
        </div>
        <ul className="ml-3 flex flex-col gap-0.5">
          {docTitles.map((title) => (
            <DocRow key={title} title={title} />
          ))}
        </ul>
      </aside>
      <div className="relative flex h-96 min-w-0 flex-1 gap-8 overflow-hidden px-5 pt-6 sm:h-112 sm:px-8 sm:pt-8">
        <div className="min-w-0 flex-1">
          <ChapterTag>Internal</ChapterTag>
          <h3 className="mt-4 text-[28px] leading-[1.1] font-semibold tracking-[-0.015em]">
            Using a VM
          </h3>
          <p className="mt-3 max-w-md border-b border-(--rule) pb-5 text-[14px] leading-[22px] text-(--sec-ink)">
            Every lab VM is shared. Book one, connect over SSH, and shut it down
            when you are done.
          </p>
          <h4 className="mt-5 text-[18px] leading-6 font-medium tracking-[-0.01em]">
            Connect to your VM
          </h4>
          <p className="mt-2 max-w-md text-[14px] leading-[22px] text-(--sec-ink)">
            Generate a key, send the public half to a lab admin, then connect
            with your Syntesa username.
          </p>
          <div className="mt-3 max-w-md overflow-hidden rounded-lg border border-(--rule) bg-(--stage) py-2 font-mono text-[13px] leading-5">
            {codeLines.map((line) => (
              <CodeLine key={line.text} {...line} />
            ))}
          </div>
        </div>
        <nav aria-hidden className="hidden w-44 shrink-0 pt-1 lg:block">
          <p className="mb-2 text-[13px] leading-5 font-medium">On this page</p>
          <ul className="border-l border-(--rule)">
            {toc.map((entry) => (
              <TocRow key={entry.text} {...entry} />
            ))}
          </ul>
        </nav>
        <div
          className={`absolute right-4 bottom-5 flex items-center gap-2.5 rounded-xl border border-(--rule) bg-(--panel) py-2.5 pr-4 pl-3 ${floatShadow}`}
        >
          <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-(--wash) text-(--blue)">
            <Check size={12} strokeWidth={2} />
          </span>
          <p className="text-[14px] leading-5 font-medium">
            Copied to clipboard
          </p>
        </div>
      </div>
    </div>
  </div>
);

export default function Home() {
  return (
    <div className="w-full bg-(--canvas) text-(--ink)">
      <section className="relative w-full overflow-hidden border-b border-(--rule) bg-(--canvas)">
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-[75%]"
          style={{
            backgroundImage: atmosphere,
            maskImage: "linear-gradient(to top, #000 30%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to top, #000 30%, transparent 100%)",
          }}
        />
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-[60%]"
          style={{
            backgroundImage: ribs,
            maskImage: "linear-gradient(to top, #000 10%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to top, #000 10%, transparent 100%)",
          }}
        />
        <Rails className="relative flex flex-col items-center px-4 pt-28 text-center sm:px-6 md:pt-38">
          <h1 className="mt-9 max-w-201.25 text-[44px] leading-[0.95] font-semibold tracking-[-0.02em] text-balance sm:text-[56px] lg:text-[64px]">
            Syntesa Knowledge Base
          </h1>
          <p className="mt-9 max-w-121.5 text-[18px] leading-[1.3] font-medium tracking-[-0.01em] text-(--support)">
            NWrite labs documentation, choose who can read it, and keep every
            change in Git.
          </p>
          <div className="mt-6 flex items-center gap-2.5">
            <Action href="/docs" variant="outline">
              Read the docs
            </Action>
            <Action href="/keystatic" variant="default" external>
              Open editor
            </Action>
          </div>
          <EditorStage />
        </Rails>
      </section>
    </div>
  );
}
