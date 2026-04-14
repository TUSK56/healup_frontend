import * as React from "react";
import { cn } from "@/lib/utils";

type AvatarCtx = {
  hasImage: boolean;
  setHasImage: (v: boolean) => void;
};

const AvatarContext = React.createContext<AvatarCtx | null>(null);

export function Avatar({ className, ...props }: React.ComponentProps<"div">) {
  const [hasImage, setHasImage] = React.useState(true);
  return (
    <AvatarContext.Provider value={{ hasImage, setHasImage }}>
      <div className={cn("relative inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-slate-100", className)} {...props} />
    </AvatarContext.Provider>
  );
}

export function AvatarImage({ className, ...props }: React.ComponentProps<"img">) {
  const ctx = React.useContext(AvatarContext);
  return (
    <img
      className={cn("h-full w-full object-cover", className)}
      onError={(e) => {
        props.onError?.(e);
        ctx?.setHasImage(false);
      }}
      onLoad={(e) => {
        props.onLoad?.(e);
        ctx?.setHasImage(true);
      }}
      {...props}
    />
  );
}

export function AvatarFallback({ className, ...props }: React.ComponentProps<"div">) {
  const ctx = React.useContext(AvatarContext);
  if (ctx?.hasImage) return null;
  return <div className={cn("flex h-full w-full items-center justify-center text-sm text-slate-500", className)} {...props} />;
}
