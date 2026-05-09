import { Link } from "react-router-dom";
import { appConfig } from "@/config/app.config";

export function Footer() {
  return (
    <footer className="border-t border-border/30 bg-background/40">
      <div className="container mx-auto flex min-h-9 items-center justify-between gap-3 px-4 py-2 text-xs text-muted-foreground/80">
        <p className="truncate">{appConfig.name} © 2026</p>
        <nav className="flex shrink-0 items-center gap-3">
          <Link
            to="/termos-de-uso"
            className="transition-colors hover:text-primary"
          >
            Termos de uso
          </Link>
        </nav>
      </div>
    </footer>
  );
}
