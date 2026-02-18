"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Document, Page, Thumbnail, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";
import { cn } from "@/lib/utils";

// Configure worker in the same module where we use Document/Page (required by react-pdf)
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const PDF_URL = "/scope-of-work.pdf";

export function PdfReviewView() {
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [containerWidth, setContainerWidth] = useState<number | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isScrollingRef = useRef(false);
  const scrollTimerRef = useRef<ReturnType<typeof setTimeout>>(null);

  // Measure container for responsive page width (client-only to avoid hydration mismatch)
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width;
      if (w != null) setContainerWidth(Math.min(680, Math.max(400, w - 32)));
    });
    ro.observe(container);
    return () => ro.disconnect();
  }, []);

  const scrollToPage = useCallback((pageNumber: number) => {
    // Suppress observer updates during programmatic scroll
    isScrollingRef.current = true;
    if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
    scrollTimerRef.current = setTimeout(() => {
      isScrollingRef.current = false;
    }, 800);

    setCurrentPage(pageNumber);
    const el = document.getElementById(`pdf-page-${pageNumber}`);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  // Observe which page is in view to sync currentPage on manual scroll only
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || numPages === 0) return;

    const pageEls = Array.from(
      container.querySelectorAll("[data-pdf-page]")
    ) as HTMLElement[];

    const observer = new IntersectionObserver(
      (entries) => {
        if (isScrollingRef.current) return;
        let best: { page: number; ratio: number } | null = null;
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const n = entry.target.getAttribute("data-pdf-page");
          if (n && entry.intersectionRatio > (best?.ratio ?? 0))
            best = {
              page: Number.parseInt(n, 10),
              ratio: entry.intersectionRatio,
            };
        }
        if (best != null) setCurrentPage(best.page);
      },
      { root: container, rootMargin: "-15% 0px -50% 0px", threshold: [0, 0.1, 0.5, 1] }
    );

    pageEls.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [numPages]);

  return (
    <Document
      file={PDF_URL}
      onLoadSuccess={({ numPages: n }) => setNumPages(n)}
      loading={
        <div className="flex h-64 items-center justify-center text-muted-foreground">
          Loading PDF…
        </div>
      }
      error={
        <div className="flex h-64 items-center justify-center text-destructive">
          Failed to load PDF.
        </div>
      }
      className="flex flex-1 min-h-0"
    >
      <div className="flex flex-1 min-h-0 gap-4">
        {/* Left: page thumbnails */}
        <aside className="w-48 shrink-0 flex flex-col gap-2 overflow-y-auto py-2 pr-2">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-2 pb-2">
            Pages
          </h2>
          {numPages > 0 &&
            Array.from({ length: numPages }, (_, i) => i + 1).map(
              (pageNumber) => (
                <button
                  key={pageNumber}
                  type="button"
                  onClick={() => scrollToPage(pageNumber)}
                  className={cn(
                    "w-full rounded-md border-2 overflow-hidden transition-colors text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                    currentPage === pageNumber
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-border border hover:border-muted-foreground/20 hover:bg-muted/50"
                  )}
                  aria-label={`Go to page ${pageNumber}`}
                  aria-current={currentPage === pageNumber ? "true" : undefined}
                >
                  <Thumbnail
                    pageNumber={pageNumber}
                    width={120}
                    onItemClick={({ pageNumber: p }) => scrollToPage(p)}
                    className="w-full! max-w-full! flex items-center justify-center"
                  />
                  <span className="block px-2 py-1 text-xs font-medium text-muted-foreground">
                    Page {pageNumber}
                  </span>
                </button>
              )
            )}
        </aside>

        {/* Center: scrollable full pages */}
        <div
          ref={scrollContainerRef}
          className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden bg-muted/30 rounded-lg"
        >
          {numPages > 0 &&
            Array.from({ length: numPages }, (_, i) => i + 1).map(
              (pageNumber) => (
                <div
                  key={pageNumber}
                  id={`pdf-page-${pageNumber}`}
                  data-pdf-page={pageNumber}
                  className="flex justify-center px-4 py-4 border-b border-border last:border-b-0"
                >
                  <Page
                    pageNumber={pageNumber}
                    width={containerWidth ?? 680}
                    renderTextLayer
                    renderAnnotationLayer
                    className="shadow-sm bg-white"
                  />
                </div>
              )
            )}
        </div>
      </div>
    </Document>
  );
}
