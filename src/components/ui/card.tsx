import * as React from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("rounded-xl bg-white", className)} {...props} />;
}

export function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("px-4 pt-4", className)} {...props} />;
}

export function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("text-base font-semibold", className)} {...props} />;
}

export function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("text-sm text-slate-500", className)} {...props} />;
}

export function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("px-4 pb-4", className)} {...props} />;
}

export function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("px-4 pb-4", className)} {...props} />;
}
