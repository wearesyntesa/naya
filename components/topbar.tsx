import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { ThemeToggle } from "./toggle-theme";
import { cn } from "@/lib/utils";

const navLinks = [{ href: "/how-to-use", label: "How to Use" }];

export function Topbar() {
  return (
    <div className="absolute top-0 flex items-center justify-between w-full h-16 px-6 sm:px-12 md:px-20 lg:px-32 bg-linear-to-b from-white/90 via-white/60 to-transparent dark:from-black/70 dark:via-black/40 dark:to-transparent backdrop-blur-sm z-10">
      <div className="flex items-center space-x-4">
        <h1 className="text-lg font-semibold text-gray-900 dark:text-neutral-100 uppercase leading-8">
          Naya
        </h1>
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
        <Link
          href="/login"
          className={cn(
            buttonVariants({ variant: "secondary", size: "sm" }),
            "group flex items-center",
          )}
        >
          Login
        </Link>
      </div>
    </div>
  );
}
