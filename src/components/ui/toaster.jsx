import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { CircleAlert, CircleCheck, TriangleAlert, X } from "lucide-react";
import { cn } from "@/lib/utils";

const MAX_TOASTS = 3;

const VARIANTS = {
  success: { icon: CircleCheck, iconClass: "text-success" },
  warning: { icon: TriangleAlert, iconClass: "text-amber-500" },
  error: { icon: CircleAlert, iconClass: "text-destructive" },
};

const ToastContext = createContext(null);

let toastSequence = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef(new Map());

  const dismiss = useCallback((id) => {
    clearTimeout(timers.current.get(id));
    timers.current.delete(id);
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const toast = useCallback(
    ({ title, description, variant = "success", duration = 5000 }) => {
      const id = (toastSequence += 1);
      setToasts((current) => [...current.slice(-(MAX_TOASTS - 1)), { id, title, description, variant }]);
      timers.current.set(id, setTimeout(() => dismiss(id), duration));
      return id;
    },
    [dismiss]
  );

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  const value = useMemo(() => ({ toast, dismiss }), [toast, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        aria-label="Notifications"
        className="pointer-events-none fixed bottom-4 right-4 z-[60] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-2"
      >
        {toasts.map(({ id, title, description, variant }) => {
          const { icon: Icon, iconClass } = VARIANTS[variant];
          return (
            <div
              key={id}
              role="status"
              className="pointer-events-auto flex items-start gap-3 rounded-md border border-gray-200 bg-white p-4 shadow-lg"
            >
              <Icon className={cn("mt-0.5 size-5 shrink-0", iconClass)} aria-hidden="true" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">{title}</p>
                {description && <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>}
              </div>
              <button
                type="button"
                onClick={() => dismiss(id)}
                className="relative rounded p-0.5 text-muted-foreground hover:bg-gray-50 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <X className="size-4" aria-hidden="true" />
                <span className="sr-only">Fermer</span>
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within a ToastProvider");
  return context;
}
