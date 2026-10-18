import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { auth } from "@/auth";
import { toMenuUser } from "@/lib/session-user";
import { ThemeToggle } from "./toggle-theme";
import { UserMenu } from "./user-menu";

const navLinks = [{ href: "/how-to-use", label: "How to Use" }];

export async function Topbar() {
  const user = toMenuUser(await auth());

  return (
    <div className="fixed top-0 left-0 flex items-center justify-between w-full h-14 px-6 sm:px-12 md:px-20 z-50">
      <div className="flex items-center space-x-4">
        <Link
          href="/"
          className="text-md font-semibold text-gray-900 dark:text-neutral-100 uppercase leading-8"
        >
          Naya
        </Link>
      </div>
      <div className="flex items-center space-x-2 sm:space-x-4">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`hidden sm:inline-flex text-neutral-800 hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-neutral-50 transition-colors duration-300 ${buttonVariants({ variant: "ghost", size: "sm" })}`}
          >
            {link.label}
          </Link>
        ))}
        <ThemeToggle />
        <div className="hidden sm:block w-px h-6 bg-neutral-200 dark:bg-neutral-800" />
        <UserMenu user={user} />
      </div>
    </div>
  );
}
