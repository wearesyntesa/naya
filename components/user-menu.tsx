"use client";

import Link from "next/link";
import { Avatar } from "@base-ui/react/avatar";
import { Popover } from "@base-ui/react/popover";
import { ChevronsUpDown, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

import { buttonVariants } from "@/components/ui/button";
import { ThemeToggle } from "@/components/toggle-theme";
import type { MenuUser } from "@/lib/session-user";
import { cn } from "@/lib/utils";

type UserMenuProps = Readonly<{
  user: MenuUser | null;
  variant?: "row" | "avatar";
  showTheme?: boolean;
}>;

function initials(user: MenuUser) {
  const source = user.name || user.username || user.email || "?";
  return source.trim().slice(0, 2).toUpperCase();
}

function UserAvatar({
  user,
  className,
}: Readonly<{ user: MenuUser; className?: string }>) {
  return (
    <Avatar.Root
      className={cn(
        "inline-flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-neutral-900/10 text-xs font-medium text-neutral-700 select-none dark:bg-white/10 dark:text-neutral-300",
        className,
      )}
    >
      {user.image && (
        <Avatar.Image
          src={user.image}
          alt={user.name || user.username || user.email || "User avatar"}
          className="size-full object-cover"
        />
      )}
      <Avatar.Fallback>{initials(user)}</Avatar.Fallback>
    </Avatar.Root>
  );
}

export function UserMenu({
  user,
  variant = "avatar",
  showTheme = false,
}: UserMenuProps) {
  const isRow = variant === "row";

  if (!user) {
    return (
      <div className={cn("flex items-center gap-1", isRow && "w-full")}>
        <Link
          href="/api/auth/signin"
          className={cn(
            buttonVariants({ variant: "secondary", size: "sm" }),
            isRow && "h-8 flex-1",
          )}
        >
          Log in
        </Link>
        {showTheme && <ThemeToggle />}
      </div>
    );
  }

  const label = user.name || user.username || user.email || "Account";

  return (
    <Popover.Root>
      <Popover.Trigger
        aria-label="Account menu"
        className={cn(
          "flex items-center gap-2.5 rounded-md text-left outline-none transition-colors focus-visible:outline-2 focus-visible:outline-neutral-500",
          isRow
            ? "h-12 w-full px-1.5 hover:bg-neutral-900/5 data-popup-open:bg-neutral-900/5 dark:hover:bg-white/5 dark:data-popup-open:bg-white/5"
            : "rounded-full",
        )}
      >
        <UserAvatar user={user} className={isRow ? "mx-1" : "size-9"} />
        {isRow && (
          <>
            <span className="min-w-0 flex-1 leading-tight">
              <span className="block truncate text-[13px] font-medium text-neutral-950 dark:text-neutral-50">
                {label}
              </span>
              {user.email && (
                <span className="block truncate text-xs text-muted-foreground">
                  {user.email}
                </span>
              )}
            </span>
            <ChevronsUpDown
              aria-hidden
              className="mr-1 size-3.5 shrink-0 text-muted-foreground"
            />
          </>
        )}
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner
          side={isRow ? "top" : "bottom"}
          align={isRow ? "start" : "end"}
          sideOffset={8}
          className="z-60"
        >
          <Popover.Popup className="w-64 origin-(--transform-origin) rounded-lg border bg-popover p-1.5 text-popover-foreground shadow-lg outline-none motion-safe:transition-[opacity,scale] motion-safe:duration-150 data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0">
            <div className="flex items-center gap-3 px-2 py-2">
              <UserAvatar user={user} className="size-10" />
              <div className="min-w-0 leading-tight">
                <p className="truncate text-sm font-medium">{label}</p>
                {user.username && (
                  <p className="truncate text-xs text-muted-foreground">
                    @{user.username}
                  </p>
                )}
                {user.email && (
                  <p className="truncate text-xs text-muted-foreground">
                    {user.email}
                  </p>
                )}
              </div>
            </div>
            <div className="my-1 h-px bg-border" />
            {showTheme && (
              <div className="flex h-10 items-center justify-between pl-2 pr-0.5 text-[13px]">
                <span>Theme</span>
                <ThemeToggle />
              </div>
            )}
            <button
              type="button"
              onClick={() => signOut({ redirectTo: "/" })}
              className="flex h-9 w-full items-center gap-2 rounded-md px-2 text-[13px] outline-none transition-colors hover:bg-neutral-900/5 focus-visible:outline-2 focus-visible:outline-neutral-500 dark:hover:bg-white/5"
            >
              <LogOut aria-hidden className="size-4" />
              Sign out
            </button>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}
