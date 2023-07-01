import * as React from "react";

import { cn } from "@/lib/utils";

export type BadgeProps = React.HTMLAttributes<HTMLDivElement>;

export function Badge({ className, ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex cursor-pointer items-center rounded-full border border-transparent bg-black px-2.5 py-0.5 text-xs font-semibold text-white transition-colors hover:bg-black/80 focus:outline-none",
        className
      )}
      {...props}
    />
  );
}
