import { LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function PageLoader({ fullScreen = false }) {
  return (
    <div
      role="status"
      className={cn(
        "flex items-center justify-center text-muted-foreground",
        fullScreen ? "h-screen" : "h-64"
      )}
    >
      <LoaderCircle className="size-6 animate-spin" aria-hidden="true" />
      <span className="sr-only">Chargement…</span>
    </div>
  );
}
