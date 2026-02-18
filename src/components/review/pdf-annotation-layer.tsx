"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useComments } from "@/context/comments-context";
import { CommentPopup } from "./comment-popup";
import { MentionInput } from "./mention-input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import type { Comment as CommentT, CommentHighlight, HighlightRect } from "@/types/discussion";
import { cn } from "@/lib/utils";
import { UserAvatar } from "@/components/user-avatar";

interface PdfAnnotationLayerProps {
  pageNumber: number;
}

function rangeToPercentRects(range: Range, container: HTMLElement): HighlightRect[] {
  const containerRect = container.getBoundingClientRect();
  const clientRects = range.getClientRects();
  const result: HighlightRect[] = [];
  for (let i = 0; i < clientRects.length; i++) {
    const r = clientRects[i];
    if (r.width < 2 || r.height < 2) continue;
    result.push({
      x: ((r.left - containerRect.left) / containerRect.width) * 100,
      y: ((r.top - containerRect.top) / containerRect.height) * 100,
      width: (r.width / containerRect.width) * 100,
      height: (r.height / containerRect.height) * 100,
    });
  }
  return result;
}

export function PdfAnnotationLayer({ pageNumber }: PdfAnnotationLayerProps) {
  const { comments, activePopupId, openPopup, closePopup, addComment } = useComments();
  const [pendingHighlight, setPendingHighlight] = useState<{
    text: string;
    x: number;
    y: number;
    rects: HighlightRect[];
  } | null>(null);
  const [newCommentText, setNewCommentText] = useState("");
  const overlayRef = useRef<HTMLDivElement>(null);

  const pageComments = comments.filter(
    (c) => c.source === "annotation" && c.highlight?.pageNumber === pageNumber
  );

  const handleMouseUp = useCallback(() => {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed || !overlayRef.current) return;

    const text = sel.toString().trim();
    if (!text) return;

    const range = sel.getRangeAt(0);
    const rangeParent = range.commonAncestorContainer as HTMLElement;
    const overlay = overlayRef.current;
    if (!overlay.parentElement?.contains(rangeParent)) return;

    const containerRect = overlay.getBoundingClientRect();
    const rect = range.getBoundingClientRect();

    const x = ((rect.right - containerRect.left) / containerRect.width) * 100;
    const y = ((rect.top - containerRect.top) / containerRect.height) * 100;
    const rects = rangeToPercentRects(range, overlay);

    setPendingHighlight({ text, x: Math.min(85, x), y: Math.min(90, y), rects });
    sel.removeAllRanges();
  }, []);

  useEffect(() => {
    document.addEventListener("mouseup", handleMouseUp);
    return () => document.removeEventListener("mouseup", handleMouseUp);
  }, [handleMouseUp]);

  const submitAnnotation = useCallback(() => {
    if (!pendingHighlight || !newCommentText.trim()) return;
    const highlight: CommentHighlight = {
      pageNumber,
      text: pendingHighlight.text,
      pinX: pendingHighlight.x,
      pinY: pendingHighlight.y,
      rects: pendingHighlight.rects,
    };
    addComment(newCommentText.trim(), highlight);
    setPendingHighlight(null);
    setNewCommentText("");
  }, [pendingHighlight, newCommentText, pageNumber, addComment]);

  const cancelAnnotation = useCallback(() => {
    setPendingHighlight(null);
    setNewCommentText("");
  }, []);

  useEffect(() => {
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") {
        cancelAnnotation();
        closePopup();
      }
    }
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [cancelAnnotation, closePopup]);

  return (
    <div
      ref={overlayRef}
      className="absolute inset-0"
      style={{ pointerEvents: "none", zIndex: 15 }}
    >
      {/* Pending highlight overlay (while typing the comment) */}
      {pendingHighlight && pendingHighlight.rects.map((r, i) => (
        <div
          key={`pending-${i}`}
          className="absolute bg-primary/20 rounded-sm"
          style={{
            left: `${r.x}%`,
            top: `${r.y}%`,
            width: `${r.width}%`,
            height: `${r.height}%`,
            pointerEvents: "none",
          }}
        />
      ))}

      {/* Existing comment pins + their highlight overlays */}
      {pageComments.map((c) => (
        <CommentPin
          key={c.id}
          comment={c}
          isActive={activePopupId === c.id}
          onOpen={() => openPopup(c.id)}
        />
      ))}

      {/* New annotation input box after text selection */}
      {pendingHighlight && (
        <div
          className="absolute"
          style={{
            left: `${pendingHighlight.x}%`,
            top: `${pendingHighlight.y}%`,
            pointerEvents: "auto",
            zIndex: 9990,
          }}
        >
          <div className="w-72 rounded-lg border border-border bg-popover shadow-xl p-3 space-y-2">
            <p className="text-xs text-muted-foreground truncate">
              &ldquo;{pendingHighlight.text.slice(0, 60)}
              {pendingHighlight.text.length > 60 ? "..." : ""}&rdquo;
            </p>
            <MentionInput
              value={newCommentText}
              onChange={setNewCommentText}
              placeholder="Add a comment..."
              rows={2}
              autoFocus
              className="text-sm"
              onSubmit={submitAnnotation}
            />
            <div className="flex gap-2 justify-end">
              <Button size="xs" variant="ghost" onClick={cancelAnnotation}>
                Cancel
              </Button>
              <Button
                size="xs"
                className="gap-1"
                disabled={!newCommentText.trim()}
                onClick={submitAnnotation}
              >
                <Send className="size-3" />
                Comment
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CommentPin({
  comment,
  isActive,
  onOpen,
}: {
  comment: CommentT;
  isActive: boolean;
  onOpen: () => void;
}) {
  const { closePopup } = useComments();
  const [hovered, setHovered] = useState(false);

  if (!comment.highlight) return null;
  const { pinX, pinY, rects } = comment.highlight;
  const showHighlight = hovered || isActive;

  return (
    <>
      {/* Highlight overlay — text rects if available, otherwise a page border */}
      {showHighlight && (
        rects.length > 0 ? (
          rects.map((r, i) => (
            <div
              key={`hl-${comment.id}-${i}`}
              className={cn(
                "absolute rounded-sm transition-opacity",
                isActive ? "bg-primary/25" : "bg-primary/15"
              )}
              style={{
                left: `${r.x}%`,
                top: `${r.y}%`,
                width: `${r.width}%`,
                height: `${r.height}%`,
                pointerEvents: "none",
              }}
            />
          ))
        ) : (
          <div
            className={cn(
              "absolute inset-0 rounded-lg transition-opacity border-3",
              isActive ? "border-primary/50" : "border-primary/30"
            )}
            style={{ pointerEvents: "none" }}
          />
        )
      )}

      <div
        className="absolute group"
        style={{
          left: `${pinX}%`,
          top: `${pinY}%`,
          pointerEvents: "auto",
          zIndex: isActive ? 9990 : 20,
        }}
      >
        <button
          type="button"
          className={cn(
            "shadow-md bg-gray-800 cursor-pointer active:scale-95 p-1 rounded-t-full rounded-r-full border-2 transition-transform",
            comment.resolved
              ? "size-8 rounded-t-full p-1 rounded-r-full flex items-center justify-center text-xs font-bold bg-green-100 text-green-700 border-green-300"
              : "border-none",
            isActive && "ring-2 ring-primary ring-offset-2 scale-110"
          )}
          onClick={(e) => { e.stopPropagation(); isActive ? closePopup() : onOpen(); }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {comment.resolved ? (
            comment.author.avatarLetter
          ) : (
            <UserAvatar letter={comment.author.avatarLetter} />
          )}
        </button>

        {/* Hover preview */}
        {hovered && !isActive && (
          <div className="absolute left-10 top-0 w-56 rounded-md border border-border bg-popover shadow-lg p-2.5" style={{ zIndex: 9980 }}>
            <div className="flex items-center gap-1.5">
              <UserAvatar letter={comment.author.avatarLetter} size="xs" />
              <span className="text-xs font-medium">{comment.author.name}</span>
              <span className="text-[10px] text-muted-foreground">{comment.timeAgo}</span>
            </div>
            <p className="text-xs text-foreground/80 mt-1 line-clamp-2">{comment.body}</p>
            {comment.replies.length > 0 && (
              <p className="text-[10px] text-primary mt-1">{comment.replies.length} repl{comment.replies.length === 1 ? "y" : "ies"}</p>
            )}
          </div>
        )}

        {/* Active popup */}
        {isActive && (
          <div className="absolute left-10 top-0" style={{ zIndex: 9999 }}>
            <CommentPopup comment={comment} />
          </div>
        )}
      </div>
    </>
  );
}
