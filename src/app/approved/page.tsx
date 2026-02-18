"use client";

import { useEffect } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import { MessageSquareText, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { AnimatedCheckIcon } from "@/components/animated-checkIcon";
import { ThemeToggle } from "@/components/theme-toggle";

export default function ApprovedPage() {
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
          <Logo />
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button asChild variant="outline" size="default" className="gap-1.5">
            <Link href="/">
              <ArrowLeft className="size-4" />
              Back to Scope
            </Link>
          </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-8">
        <div className="text-center max-w-md space-y-6">
          <AnimatedCheckIcon />
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
                <span className="mt-1 text-primary">✓</span>
                The project team will receive your approval
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 text-primary">✓</span>
                Phase 1 kickoff will be scheduled within 48 hours
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 text-primary">✓</span>
                You&apos;ll receive a calendar invite for the first check-in
              </li>
            </ul>
          </div>

          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Button asChild variant="outline" className="gap-1.5">
              <Link href="/">
                <ArrowLeft className="size-4" />
                Back to Scope
              </Link>
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
