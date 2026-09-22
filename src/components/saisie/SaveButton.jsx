import { FilePen, Save } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SaveButton({ isBalanced, disabled }) {
  return (
    <Button
      type="submit"
      variant={isBalanced ? "default" : "warning"}
      disabled={disabled}
      className="min-w-44"
    >
      {isBalanced ? <Save aria-hidden="true" /> : <FilePen aria-hidden="true" />}
      {isBalanced ? "Save" : "Save as Draft / Brouillon"}
    </Button>
  );
}
