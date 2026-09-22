import { useEffect } from "react";
import { matchPath, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AlertsMenu } from "@/layouts/AlertsMenu";
import { NAV_ITEMS } from "@/layouts/navigation";
import { cn } from "@/lib/utils";

function usePageTitle() {
  const { pathname } = useLocation();
  const item = NAV_ITEMS.find(({ to, end }) => matchPath({ path: to, end: end ?? false }, pathname));
  return item?.label ?? "Compta MVP";
}

export function Header({ collapsed, sidebarOpen, onOpenSidebar }) {
  const title = usePageTitle();

  useEffect(() => {
    document.title = `${title} · Compta MVP`;
  }, [title]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-20 flex h-16 items-center gap-3 border-b bg-white px-4 transition-[left] duration-200 lg:px-8",
        collapsed ? "lg:left-16" : "lg:left-64"
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        className="-ml-2 lg:hidden"
        onClick={onOpenSidebar}
        aria-controls="app-sidebar"
        aria-expanded={sidebarOpen}
      >
        <Menu aria-hidden="true" />
        <span className="sr-only">Ouvrir le menu</span>
      </Button>

      <h1 className="truncate text-lg font-semibold tracking-tight">{title}</h1>

      <div className="ml-auto">
        <AlertsMenu />
      </div>
    </header>
  );
}
