"use client";

import Link from "next/link";
import {
  FileText,
  MessageSquareText,
  Clock,
  DollarSign,
  Users,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ApproveButton } from "@/components/approve-button";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";

export function ScopeLanding() {
  return (
    <div className="flex h-screen flex-col bg-background">
      <LandingNav />

      <main className="flex-1 min-h-0 overflow-y-auto bg-muted/30">
        <div className="max-w-4xl mx-auto px-6">
          {/* Project info strip */}
          <div className="py-5 border-b border-border">
            <div className="flex items-start justify-between gap-6">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center border border-primary/20 rounded-xl text-primary shrink-0">
                  <FileText className="size-5" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-foreground leading-tight">
                    Inventory Management System
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Scope of Work
                  </p>
                </div>
              </div>
              <Badge
                variant="secondary"
                className="bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-700 shrink-0 mt-1"
              >
                Awaiting Review
              </Badge>
            </div>

            <div className="flex items-center gap-6 mt-4 justify-between px-2">
              <DetailChip icon={Users} label="Client" value="Alex - Logistics Co" />
              <DetailChip icon={Calendar} label="Timeline" value="12 weeks" />
              <DetailChip icon={DollarSign} label="Investment" value="£45,000" />
              <DetailChip icon={Clock} label="Sent" value="Feb 18, 2026" />
            </div>
          </div>

          {/* PDF viewer */}
          <div className="pt-6">
            <iframe
              title="Scope of Work — Full Preview"
              src="/scope-of-work.pdf"
              className="w-full rounded-lg border border-border shadow-sm bg-white"
              style={{ height: "calc(100vh - 13rem)" }}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

function LandingNav() {
  return (
    <header className="border-b border-border bg-background shrink-0">
      <div className="flex h-14 items-center justify-between gap-4 px-6">
        <Logo projectName="Inventory Management System" />
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button asChild variant="outline" size="default" className="gap-1.5">
            <Link href="/review">
              <MessageSquareText className="size-4" />
              Review &amp; Comment
            </Link>
          </Button>
          <ApproveButton size="default" className="gap-1.5" />
        </div>
      </div>
    </header>
  );
}

function DetailChip({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <Icon className="size-3.5 text-muted-foreground shrink-0" />
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}
