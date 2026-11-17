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
    <main className="min-h-dvh relative isolate flex flex-col items-center justify-center w-full bg-(--canvas) overflow-clip text-(--ink)">
      {!pathname.startsWith("/docs") && topbar}
      {children}
    </main>
  );
}
