import * as React from "react";
import { cn } from "@/lib/utils";

export function Table({ className, ...props }: React.ComponentProps<"table">) {
  return (
    <div className="relative w-full overflow-x-auto">
      <table className={cn("w-full caption-bottom text-sm", className)} {...props} />
    </div>
  );
}

export function TableHeader(props: React.ComponentProps<"thead">) {
  return <thead {...props} />;
}

export function TableBody(props: React.ComponentProps<"tbody">) {
  return <tbody {...props} />;
}

export function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return <tr className={cn("border-b", className)} {...props} />;
}

export function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return <th className={cn("px-2 py-3 text-right font-medium", className)} {...props} />;
}

export function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return <td className={cn("px-2 py-3 align-middle", className)} {...props} />;
}
