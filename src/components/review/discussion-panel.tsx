"use client";

import { useState, useRef, useEffect } from "react";
import { MessageSquare, MessageSquareText, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CommentThread } from "./comment-thread";
import { MentionInput } from "./mention-input";
import { useComments } from "@/context/comments-context";

export function DiscussionPanel() {
  const { comments, addComment } = useComments();
  const [newComment, setNewComment] = useState("");
  const hasNewActivity = comments.length > 0;
  const listRef = useRef<HTMLDivElement>(null);
  const prevCountRef = useRef(comments.length);

  useEffect(() => {
    if (comments.length > prevCountRef.current) {
      listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
    }
    prevCountRef.current = comments.length;
  }, [comments.length]);

  function handleSubmit() {
    const trimmed = newComment.trim();
    if (!trimmed) return;
    addComment(trimmed);
    setNewComment("");
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 pb-3 border-b border-border">
        <div className="flex size-8.5 items-center border justify-center rounded-lg text-primary">
          <MessageSquareText className="size-5" />
        </div>
        <h2 className="text-sm font-semibold text-foreground">Discussion</h2>
        {hasNewActivity && (
          <span
            className="size-2 rounded-full bg-destructive shrink-0"
            aria-label="New activity"
          />
        )}
        <span className="ml-auto text-xs text-muted-foreground">
          {comments.length} thread{comments.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div ref={listRef} className="flex-1 overflow-y-auto py-4 space-y-6 min-h-0">
        {comments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground text-sm">
            <MessageSquare className="size-8 mb-2 opacity-40" />
            <p>No comments yet</p>
            <p className="text-xs mt-1">Highlight text on the PDF or add a comment below</p>
          </div>
        ) : (
          comments.map((comment) => (
            <CommentThread key={comment.id} comment={comment} />
          ))
        )}
      </div>

      <form
        onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}
        className="pt-4 border-t border-border flex flex-col gap-2"
      >
        <MentionInput
          value={newComment}
          onChange={setNewComment}
          placeholder="Add a comment... (type @ to mention a page)"
          rows={2}
          onSubmit={handleSubmit}
        />
        <div className="flex items-center justify-end">
          <Button type="submit" size="sm" className="gap-1" disabled={!newComment.trim()}>
            <Send className="size-3.5" />
            Send
          </Button>
        </div>
      </form>
    </div>
  );
}
