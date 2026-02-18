"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ApproveButton } from "@/components/approve-button";
import { Logo } from "@/components/logo";
import { UserAvatar } from "@/components/user-avatar";

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
          <Logo projectName="Inventory Management System" />
          <Badge
            variant="secondary"
            className="bg-amber-100 text-amber-800 border-amber-200"
          >
            In Review
          </Badge>
        </div>


        <div className="flex items-center gap-4">
          <div className="flex -space-x-2">
            <UserAvatar letter="S" size="lg" title="Sarah" className="border-2 border-white" />
            <UserAvatar letter="A" size="lg" title="Alex" className="border-2 border-white" />
          </div>
          <ApproveButton size="default" className="gap-1.5" />
        </div>
      </div>
    </header>
  );
}
