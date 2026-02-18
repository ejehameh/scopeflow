"use client";

/** Skeleton layout matching PDF review: thumbnails sidebar + main viewer. */
export function PdfReviewSkeleton() {
  return (
    <div className="flex flex-1 min-h-0 gap-4 animate-pulse">
      {/* Thumbnails sidebar - matches w-48, thumbnail width 120, portrait aspect ~1.3 */}
      <aside className="w-48 shrink-0 flex flex-col gap-2 overflow-hidden py-2 pr-2">
        <div className="h-3.5 w-14 rounded bg-muted px-2" />
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex flex-col gap-1.5">
            <div
              className="w-full rounded-md bg-muted overflow-hidden"
              style={{ aspectRatio: "120/155" }}
            />
            <div className="h-3 w-10 rounded bg-muted/80 mx-1" />
          </div>
        ))}
      </aside>

      {/* Main PDF viewer area - single page proportion (e.g. A4-ish) */}
      <div className="flex-1 min-w-0 overflow-hidden bg-muted/30 rounded-lg flex items-center justify-center p-4">
        <div
          className="w-full max-w-[680px] rounded-lg bg-muted shadow-sm"
          style={{ aspectRatio: "1/1.41", minHeight: 400 }}
        />
      </div>
    </div>
  );
}
