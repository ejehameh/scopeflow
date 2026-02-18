"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ChevronDown,
  FileText,
  History,
  Home,
  FolderOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Project Home", href: "#", icon: Home },
  { label: "History", href: "#", icon: History },
  { label: "Files", href: "#", icon: FolderOpen },
];

export function ReviewNav() {
  return (
    <header className="border-b border-border bg-background shrink-0">
      <div className="flex h-14 items-center justify-between gap-4 px-6">
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="icon-sm">
            <Link href="/" aria-label="Back to scope overview">
              <ArrowLeft className="size-4" />
            </Link>
          </Button>
          <div className="flex size-9 items-center justify-center rounded-lg border text-primary">
            <FileText className="size-5" />
          </div>
          <span className="font-semibold text-foreground">
            Inventory Management System
          </span>
          <Badge
            variant="secondary"
            className="bg-amber-100 text-amber-800 border-amber-200"
          >
            In Review
          </Badge>
        </div>

        <nav className="flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <Icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild size="default">
            <Link href="/">Approve Scope</Link>
          </Button>
          <div className="flex -space-x-2">
            <div
              className="size-8 rounded-full border-2 border-background bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground"
              title="Alex"
            >
              A
            </div>
            <div
              className="size-8 rounded-full border-2 border-background bg-primary/20 flex items-center justify-center text-xs font-medium text-primary relative"
              title="Sarah"
            >
              S
              <span className="absolute -top-0.5 -right-0.5 size-2 rounded-full bg-destructive" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
