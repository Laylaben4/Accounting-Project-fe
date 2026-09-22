import { useNavigate } from "react-router-dom";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ACCOUNTING_ALERTS } from "@/data/alerts";
import { cn } from "@/lib/utils";

const TONE_CLASSES = {
  warning: "text-amber-700 focus:bg-amber-50 focus:text-amber-800",
  destructive: "text-destructive focus:bg-destructive/10 focus:text-destructive",
};

export function AlertsMenu({ alerts = ACCOUNTING_ALERTS }) {
  const navigate = useNavigate();
  const count = alerts.length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell aria-hidden="true" />
          {count > 0 && (
            <span
              aria-hidden="true"
              className="absolute right-1.5 top-1.5 flex size-4 items-center justify-center rounded-full bg-destructive text-[10px] font-semibold text-white"
            >
              {count}
            </span>
          )}
          <span className="sr-only">Alertes comptables ({count})</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="font-semibold">Alertes Comptables</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {count === 0 ? (
          <p className="px-2 py-3 text-sm text-muted-foreground">Aucune alerte en cours.</p>
        ) : (
          alerts.map((alert) => (
            <DropdownMenuItem
              key={alert.id}
              onSelect={() => navigate(alert.to)}
              className={cn("py-2 font-medium", TONE_CLASSES[alert.tone])}
            >
              <span aria-hidden="true">{alert.emoji}</span>
              {alert.label}
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
