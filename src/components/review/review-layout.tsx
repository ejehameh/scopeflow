"use client";

import { ReviewNav } from "./review-nav";
import { DiscussionPanel } from "./discussion-panel";

interface ReviewLayoutProps {
  PdfReviewView: React.ComponentType;
}

export function ReviewLayout({ PdfReviewView }: ReviewLayoutProps) {
  return (
    <div className="flex h-screen flex-col bg-background">
      <ReviewNav />

      <div className="flex flex-1 min-h-0">
        {/* Left + Center: PDF page thumbnails + viewer (one PDF load, full control for future highlight-to-comment) */}
        <main className="flex-1 min-w-0 flex flex-col px-4 overflow-hidden border-r border-border">
          <PdfReviewView />
        </main>

        {/* Right: Discussion */}
        <aside className="w-96 shrink-0 border-border flex flex-col p-4 overflow-hidden bg-muted/20">
          <DiscussionPanel />
        </aside>
      </div>
    </div>
  );
}
