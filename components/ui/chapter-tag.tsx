import type { ReactNode } from "react";

export const ChapterTag = ({ children }: { children: ReactNode }) => (
  <span className="inline-flex h-6 items-center rounded-lg bg-(--wash) px-1.5 text-[14px] leading-5 font-medium tracking-[-0.01em] text-(--label)">
    {children}
  </span>
);
