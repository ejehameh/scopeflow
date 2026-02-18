"use client";

import { useState } from "react";
import { MessageSquare, Paperclip, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CommentThread } from "./comment-thread";
import type { Comment } from "@/types/discussion";
import { cn } from "@/lib/utils";

const INITIAL_COMMENTS: Comment[] = [
  {
    id: "1",
    author: {
      name: "Alex",
      role: "Logistics Co",
      avatarLetter: "A",
    },
    body: "Can we add real-time tracking to Phase 2? Our warehouse needs to see where products are at all times.",
    timeAgo: "About 27 minutes ago",
    sectionId: "phase-2",
    replies: [
      {
        id: "1-1",
        author: {
          name: "Sarah Miller",
          role: "Team",
          avatarLetter: "S",
        },
        body: "Yes, we can include that. We've updated the scope in Phase 2. It will shift the timeline for that phase by 3 days.",
        timeAgo: "About 17 minutes ago",
        replies: [],
      },
    ],
  },
];

export function DiscussionPanel() {
  const [comments, setComments] = useState<Comment[]>(INITIAL_COMMENTS);
  const [newComment, setNewComment] = useState("");
  const [hasNewActivity] = useState(true);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = newComment.trim();
    if (!trimmed) return;
    setComments((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        author: {
          name: "Alex",
          role: "Logistics Co",
          avatarLetter: "A",
        },
        body: trimmed,
        timeAgo: "Just now",
        replies: [],
      },
    ]);
    setNewComment("");
  }

  function handleReply(commentId: string, body: string) {
    const newReply: Comment = {
      id: `${commentId}-${Date.now()}`,
      author: {
        name: "Sarah Miller",
        role: "Team",
        avatarLetter: "S",
      },
      body,
      timeAgo: "Just now",
      replies: [],
    };
    setComments((prev) =>
      prev.map((c) =>
        c.id === commentId
          ? { ...c, replies: [...c.replies, newReply] }
          : c
      )
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 pb-3 border-b border-border">
        <MessageSquare className="size-4 text-muted-foreground" />
        <h2 className="text-sm font-semibold text-foreground">Discussion</h2>
        {hasNewActivity && (
          <span
            className="size-2 rounded-full bg-destructive shrink-0"
            aria-label="New activity"
          />
        )}
      </div>

      <div className="flex-1 overflow-y-auto py-4 space-y-6 min-h-0">
        {comments.map((comment) => (
          <CommentThread
            key={comment.id}
            comment={comment}
            onReply={handleReply}
          />
        ))}
      </div>

      <form
        onSubmit={handleSubmit}
        className="pt-4 border-t border-border flex flex-col gap-2"
      >
        <Textarea
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          rows={2}
          className="resize-none"
        />
        <div className="flex items-center justify-between">
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            className="text-muted-foreground"
            aria-label="Attach file"
          >
            <Paperclip className="size-3.5" />
          </Button>
          <Button type="submit" size="sm" className="gap-1">
            <Send className="size-3.5" />
            Send
          </Button>
        </div>
      </form>
    </div>
  );
}
