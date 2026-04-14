import * as React from "react";
import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "secondary" | "outline";

const VARIANT_CLASS: Record<BadgeVariant, string> = {
  default: "bg-[#0456AE] text-white",
  secondary: "bg-slate-100 text-slate-700",
  outline: "border border-slate-200 text-slate-600",
};

export function Badge({ className, variant = "default", ...props }: React.ComponentProps<"span"> & { variant?: BadgeVariant }) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium", VARIANT_CLASS[variant], className)} {...props} />
  );
}
