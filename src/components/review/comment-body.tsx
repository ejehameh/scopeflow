"use client";

import { useComments } from "@/context/comments-context";

const MENTION_RE = /@(Page\s+\d+)/gi;

export function CommentBody({ text }: { text: string }) {
  const { scrollToPage } = useComments();

  const parts: (string | { mention: string; page: number })[] = [];
  let lastIndex = 0;

  for (const match of text.matchAll(MENTION_RE)) {
    const idx = match.index!;
    if (idx > lastIndex) parts.push(text.slice(lastIndex, idx));
    const pageNum = Number.parseInt(match[1].replace(/\D/g, ""), 10);
    parts.push({ mention: match[0], page: pageNum });
    lastIndex = idx + match[0].length;
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));

  if (parts.length === 1 && typeof parts[0] === "string") {
    return <>{text}</>;
  }

  return (
    <>
      {parts.map((part, i) =>
        typeof part === "string" ? (
          <span key={i}>{part}</span>
        ) : (
          <button
            key={i}
            type="button"
            className="inline-flex cursor-pointer items-center gap-0.5 text-primary bg-primary/10 border border-primary/20 rounded px-1 py-0.5 text-xs font-medium hover:bg-primary/20 transition-colors mx-0.5 align-baseline"
            onClick={(e) => {
              e.stopPropagation();
              scrollToPage(part.page);
            }}
          >
            {part.mention}
          </button>
        )
      )}
    </>
  );
}
