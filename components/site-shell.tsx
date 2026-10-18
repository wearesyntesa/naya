"use client";

import { usePathname } from "next/navigation";

export function SiteShell({
  topbar,
  children,
}: Readonly<{ topbar: React.ReactNode; children: React.ReactNode }>) {
  const pathname = usePathname();

  if (pathname.startsWith("/keystatic")) {
    return <>{children}</>;
  }

  return (
    <main className="min-h-dvh relative isolate flex flex-col items-center justify-center w-full bg-stone-50 dark:bg-stone-900 overflow-clip text-gray-900 dark:text-neutral-100">
      {!pathname.startsWith("/docs") && (
        <>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-size-[3rem_3rem] opacity-60 dark:opacity-100"
            style={{
              maskImage:
                "radial-gradient(ellipse 80% 70% at 50% 35%, #000 20%, transparent 100%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 80% 70% at 50% 35%, #000 20%, transparent 100%)",
            }}
          />
          {topbar}
        </>
      )}
      {children}
    </main>
  );
}
