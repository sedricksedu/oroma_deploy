import * as React from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

// Simple Sheet implementation using Dialog for compatibility
const Sheet = Dialog;
const SheetTrigger = DialogTrigger;

interface SheetContentProps extends React.ComponentPropsWithoutRef<typeof DialogContent> {
  side?: "left" | "right" | "top" | "bottom";
}

const SheetContent = React.forwardRef<
  React.ElementRef<typeof DialogContent>,
  SheetContentProps
>(({ className, side = "right", ...props }, ref) => (
  <DialogContent
    ref={ref}
    className={cn(
      "fixed z-50 gap-4 bg-background p-6 shadow-lg transition-all duration-300",
      side === "right" && "right-0 top-0 h-full max-w-sm border-l",
      side === "left" && "left-0 top-0 h-full max-w-sm border-r",
      side === "top" && "top-0 left-0 right-0 max-h-96 border-b",
      side === "bottom" && "bottom-0 left-0 right-0 max-h-96 border-t",
      className
    )}
    {...props}
  />
));

SheetContent.displayName = "SheetContent";

const SheetHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col space-y-2 text-center sm:text-left", className)} {...props} />
);

const SheetTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3 ref={ref} className={cn("text-lg font-semibold text-foreground", className)} {...props} />
));

SheetTitle.displayName = "SheetTitle";

const SheetDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
));

SheetDescription.displayName = "SheetDescription";

export {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
};