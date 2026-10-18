"use client";

import { useRef, type ComponentProps } from "react";
import { CopyButton } from "./copy-button";

export function CodeBlock(props: ComponentProps<"pre">) {
  const ref = useRef<HTMLPreElement>(null);
  return (
    <div className="group/code relative">
      <pre ref={ref} {...props} />
      <CopyButton targetRef={ref} />
    </div>
  );
}
