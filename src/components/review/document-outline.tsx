"use client";

import { cn } from "@/lib/utils";
import type { DocumentSection } from "@/data/document-outline";

interface DocumentOutlineProps {
  sections: DocumentSection[];
  activeId: string | null;
  onSelect: (id: string) => void;
}

export function DocumentOutline({
  sections,
  activeId,
  onSelect,
}: DocumentOutlineProps) {
  return (
    <nav className="flex flex-col gap-0">
      <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-3 pb-3">
        Document Outline
      </h2>
      <ul className="space-y-0.5">
        {sections.map((section) => (
          <li key={section.id}>
            <button
              type="button"
              onClick={() => onSelect(section.id)}
              className={cn(
                "w-full text-left rounded-md px-3 py-2 text-sm transition-colors",
                activeId === section.id
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-foreground/90 hover:bg-muted hover:text-foreground"
              )}
            >
              {section.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
