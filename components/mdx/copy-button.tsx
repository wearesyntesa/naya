"use client";

import { useState, type RefObject } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CopyButton({
  targetRef,
}: Readonly<{ targetRef: RefObject<HTMLElement | null> }>) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    const text = targetRef.current?.textContent ?? "";
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard
    }
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-xs"
      aria-label={copied ? "Copied" : "Copy code"}
      onClick={copy}
      className="absolute top-2 right-2 opacity-0 transition-opacity group-hover/code:opacity-100 focus-visible:opacity-100"
    >
      {copied ? <Check /> : <Copy />}
    </Button>
  );
}
