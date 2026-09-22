/** The page title lives in the top Header; this row holds the page description and actions. */
export function PageHeader({ description, actions }) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
      {description && <p className="text-sm text-muted-foreground">{description}</p>}
      {actions && <div className="ml-auto flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}
