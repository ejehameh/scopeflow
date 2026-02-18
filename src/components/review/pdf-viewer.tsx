"use client";

export function PdfViewer() {
  return (
    <div className="h-full w-full min-h-0 flex flex-col bg-muted/30 rounded-lg overflow-hidden">
      <iframe
        title="Project Scope & Deliverables"
        src="/scope-of-work.pdf"
        className="flex-1 w-full min-h-[600px] border-0 bg-white"
      />
    </div>
  );
}
