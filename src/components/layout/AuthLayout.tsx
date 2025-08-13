import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function AuthLayout({ children, className }: { children: ReactNode, className?: string }) {
  return (
    <div className={cn(
      "min-h-screen w-full bg-gradient-hero flex items-center justify-center p-4",
      className
    )}>
      {children}
    </div>
  );
}