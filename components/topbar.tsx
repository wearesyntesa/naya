import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { auth } from "@/auth";
import { toMenuUser } from "@/lib/session-user";
import { UserMenu } from "./user-menu";

const navLinks = [
  { href: "/docs", label: "Docs" },
  { href: "/how-to-use", label: "How to use" },
];

export async function Topbar() {
  const user = toMenuUser(await auth());

  return (
    <header className="fixed top-0 left-0 z-50 h-16 w-full border-b border-(--rule) bg-white">
      <div className="mx-auto h-full w-full max-w-360 px-6">
        <div className="flex h-full items-center justify-between px-4 sm:px-6">
          <nav className="flex items-center gap-1">
            <Link
              href="/"
              className="mr-3 text-[17px] leading-8 font-semibold tracking-[-0.02em] text-(--ink)"
            >
              naya.
            </Link>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`hidden sm:inline-flex ${buttonVariants({ variant: "ghost" })}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <UserMenu user={user} />
        </div>
      </div>
    </header>
  );
}
