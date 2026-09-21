import { Topbar } from "@/components/topbar";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-dvh relative flex flex-col items-center justify-center w-full bg-neutral-50 dark:bg-neutral-950 overflow-hidden text-gray-900 dark:text-neutral-100">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_50%_-10%,rgba(139,92,246,0.35),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_90%,rgba(59,130,246,0.2),transparent)]" />

      <Topbar />
      <section className="z-20 w-full px-6 sm:px-12 md:px-20 lg:px-32">
        <div className="flex flex-col text-center items-center justify-center">
          <h1 className="mx-auto max-w-2xl text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight">
            <span className="dark:text-neutral-50/50">Syntesa</span> Knowledge
            Base System
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-neutral-600 dark:text-neutral-400 text-base sm:text-lg leading-7">
            Alows you to create, share and manage your own knowledge base.
            Managed by Syntesa members, and powered by{" "}
            <a
              href="https://keystatic.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-neutral-900 dark:hover:text-neutral-50 underline"
            >
              Keystatic
            </a>{" "}
            and Next.js.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-xs sm:max-w-none">
            <Link
              href="/keystatic"
              target="_blank"
              rel="noopener noreferrer"
              className="group text-[0.875rem] p-1.5 px-4 flex items-center justify-center gap-1.5 rounded-md border border-neutral-50/20 bg-indigo-600 dark:bg-indigo-800 text-white transition-colors duration-300 hover:bg-indigo-700 dark:hover:bg-indigo-900/70 font-medium w-full sm:w-auto"
            >
              Go to Dashboard
            </Link>
            <Link
              href="/docs"
              className="group text-[0.875rem] p-1.5 px-4 flex items-center justify-center gap-1.5 rounded-md border border-neutral-50/20 bg-neutral-950 text-white transition-colors duration-300 hover:bg-neutral-800 dark:hover:bg-neutral-800/10 font-medium w-full sm:w-auto"
            >
              See Labs Documentations
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
