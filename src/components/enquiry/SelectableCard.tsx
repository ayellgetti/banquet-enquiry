import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export const SelectableCard = ({
  selected,
  onClick,
  title,
  subtitle,
  price,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  title: string;
  subtitle?: string;
  price?: string;
  children?: React.ReactNode;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      "relative w-full rounded-lg border p-4 text-left transition-all hover:border-primary/40 hover:shadow-sm",
      selected
        ? "border-primary ring-2 ring-primary/20 bg-primary/5"
        : "border-border bg-card",
    )}
  >
    {selected && (
      <div className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
        <Check className="h-4 w-4" />
      </div>
    )}
    <div className="font-medium text-foreground">{title}</div>
    {subtitle && <div className="mt-0.5 text-sm text-muted-foreground">{subtitle}</div>}
    {price && <div className="mt-2 text-sm font-semibold text-primary">{price}</div>}
    {children}
  </button>
);