import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Loader2, CheckCircle2, AlertCircle, FileCheck, XCircle } from "lucide-react";

interface StatusBadgeProps {
  status: "Processing" | "Ready" | "Review" | "Exported" | "Error";
  className?: string;
}

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  const configs = {
    Processing: {
      label: "Processing",
      icon: Loader2,
      className: "border-amber-500/50 bg-amber-500/10 text-amber-500",
      iconClassName: "animate-spin",
    },
    Ready: {
      label: "Ready",
      icon: CheckCircle2,
      className: "border-green-500/50 bg-green-500/10 text-green-500",
      iconClassName: "",
    },
    Review: {
      label: "Review",
      icon: AlertCircle,
      className: "border-blue-500/50 bg-blue-500/10 text-blue-500",
      iconClassName: "",
    },
    Exported: {
      label: "Exported",
      icon: FileCheck,
      className: "border-slate-500/50 bg-slate-500/10 text-slate-400",
      iconClassName: "",
    },
    Error: {
      label: "Error",
      icon: XCircle,
      className: "border-red-500/50 bg-red-500/10 text-red-500",
      iconClassName: "",
    },
  };

  const config = configs[status];
  const Icon = config.icon;

  return (
    <Badge
      variant="outline"
      className={cn(
        "gap-1 text-xs font-medium",
        config.className,
        className
      )}
    >
      <Icon className={cn("h-3 w-3", config.iconClassName)} />
      {config.label}
    </Badge>
  );
}
