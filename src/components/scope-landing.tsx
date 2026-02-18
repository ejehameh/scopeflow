"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import {
  FileText,
  MessageSquareText,
  CheckCircle2,
  ArrowLeft,
  Clock,
  DollarSign,
  Users,
  Calendar,
  CheckCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type Screen = "landing" | "approved";

export function ScopeLanding() {
  const [screen, setScreen] = useState<Screen>("landing");

  const handleApprove = useCallback(() => {
    setScreen("approved");
  }, []);

  if (screen === "approved") {
    return <ApprovalSuccess onBack={() => setScreen("landing")} />;
  }

  return <LandingView onApprove={handleApprove} />;
}

function LandingView({ onApprove }: { onApprove: () => void }) {
  return (
    <div className="flex h-screen flex-col bg-background">
      <LandingNav onApprove={onApprove} />

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
                className="bg-amber-100 text-amber-800 border-amber-200 shrink-0 mt-1"
              >
                Awaiting Review
              </Badge>
            </div>

            <div className="flex items-center gap-6 mt-4 flex-wrap">
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

function LandingNav({ onApprove }: { onApprove: () => void }) {
  return (
    <header className="border-b border-border bg-background shrink-0">
      <div className="flex h-14 items-center justify-between gap-4 px-6">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-lg text-2xl font-bold bg-primary/10 text-primary">
            S
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground">ScopeFlow</span>
            <span className="text-muted-foreground">/</span>
            <span className="text-sm text-muted-foreground">
              Inventory Management System
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="default" className="gap-1.5">
            <Link href="/review">
              <MessageSquareText className="size-4" />
              Review &amp; Comment
            </Link>
          </Button>
          <Button size="default" className="gap-1.5" onClick={onApprove}>
            <CheckCheck className="size-4" />
            Approve Scope
          </Button>
        </div>
      </div>
    </header>
  );
}

function ApprovalSuccess({ onBack }: { onBack: () => void }) {
  useEffect(() => {
    const duration = 2500;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: ["#6366f1", "#8b5cf6", "#a78bfa", "#c4b5fd", "#22c55e"],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: ["#6366f1", "#8b5cf6", "#a78bfa", "#c4b5fd", "#22c55e"],
      });

      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  }, []);

  return (
    <div className="flex h-screen flex-col bg-background">
      <header className="border-b border-border bg-background shrink-0">
        <div className="flex h-14 items-center justify-between gap-4 px-6">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <FileText className="size-5" />
            </div>
            <span className="font-semibold text-foreground">ScopeFlow</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="default" className="gap-1.5" onClick={onBack}>
              <ArrowLeft className="size-4" />
              Back to Scope
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-8">
        <div className="text-center max-w-md space-y-6">
          <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-green-100 text-green-600">
            <CheckCircle2 className="size-10" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold text-foreground">
              Scope Approved!
            </h1>
            <p className="text-muted-foreground">
              You&apos;ve approved the Scope of Work for the{" "}
              <span className="font-medium text-foreground">
                Inventory Management System
              </span>
              . The team has been notified and will begin work shortly.
            </p>
          </div>

          <div className="rounded-lg border border-border bg-muted/30 p-4 text-left space-y-3">
            <h2 className="text-sm font-semibold text-foreground">
              What happens next
            </h2>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="mt-1 text-green-500">✓</span>
                The project team will receive your approval
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 text-green-500">✓</span>
                Phase 1 kickoff will be scheduled within 48 hours
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 text-green-500">✓</span>
                You&apos;ll receive a calendar invite for the first check-in
              </li>
            </ul>
          </div>

          <div className="flex items-center justify-center gap-3">
            <Button variant="outline" className="gap-1.5" onClick={onBack}>
              <ArrowLeft className="size-4" />
              Back to Scope
            </Button>
            <Button asChild className="gap-1.5">
              <Link href="/review">
                <MessageSquareText className="size-4" />
                View Comments
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
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
