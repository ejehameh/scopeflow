"use client";

import Link from "next/link";
import {
  ChevronDown,
  FileText,
  History,
  Home,
  MessageSquare,
  FolderOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "IN REVIEW", href: "#", active: true },
  { label: "Project Home", href: "#", icon: Home },
  { label: "History", href: "#", icon: History },
  { label: "Files", href: "#", icon: FolderOpen },
];

export function ReviewNav() {
  return (
    <header className="border-b border-border bg-background shrink-0">
      <div className="flex h-14 items-center justify-between gap-4 px-6">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <FileText className="size-5" />
          </div>
          <span className="font-semibold text-foreground">
            Inventory Management System
          </span>
        </div>

        <nav className="flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.active;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-amber-100 text-amber-900 dark:bg-amber-950/50 dark:text-amber-200"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {Icon && <Icon className="size-4" />}
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="default" className="gap-1">
                Request Changes
                <ChevronDown className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <div className="p-2 text-sm text-muted-foreground">
                Coming in a future update.
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button size="default">Approve Scope</Button>
          <div className="flex -space-x-2">
            <div
              className="size-8 rounded-full border-2 border-background bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground"
              title="User 1"
            >
              A
            </div>
            <div
              className="size-8 rounded-full border-2 border-background bg-primary/20 flex items-center justify-center text-xs font-medium text-primary relative"
              title="User 2"
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
