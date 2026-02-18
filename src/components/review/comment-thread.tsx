"use client";

import { useState } from "react";
import type { Comment } from "@/types/discussion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";

function AuthorAvatar({ letter }: { letter: string }) {
  return (
    <div
      className="size-8 rounded-full bg-primary/15 text-primary flex items-center justify-center text-sm font-medium shrink-0"
      aria-hidden
    >
      {letter}
    </div>
  );
}

function SingleComment({
  author,
  body,
  timeAgo,
  isReply,
}: {
  author: Comment["author"];
  body: string;
  timeAgo: string;
  isReply?: boolean;
}) {
  return (
    <div className={cn("flex gap-3", isReply && "flex items-start")}>
      <AuthorAvatar letter={author.avatarLetter} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground">
          {author.name}
          {author.role ? (
            <span className="text-muted-foreground font-normal">
              {" "}
              ({author.role})
            </span>
          ) : null}
        </p>
        {/* Chat bubble */}
        <div
          className={cn(
            "mt-1.5 rounded-2xl px-4 py-2.5 text-sm text-foreground",
            "bg-muted/90 border border-border/80 shadow-sm",
            "rounded-tl-md"
          )}
        >
          {body}
        </div>
        <p className="text-xs text-muted-foreground mt-1.5">{timeAgo}</p>
      </div>
    </div>
  );
}

interface CommentThreadProps {
  comment: Comment;
  onReply?: (commentId: string, body: string) => void;
}

export function CommentThread({ comment, onReply }: CommentThreadProps) {
  const [replyText, setReplyText] = useState("");
  const [showReplyInput, setShowReplyInput] = useState(false);

  const handleSubmitReply = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = replyText.trim();
    if (!trimmed || !onReply) return;
    onReply(comment.id, trimmed);
    setReplyText("");
    setShowReplyInput(false);
  };

  return (
    <div className="flex flex-col gap-3">
      <SingleComment
        author={comment.author}
        body={comment.body}
        timeAgo={comment.timeAgo}
      />
      {onReply && (
        <div className="ml-11">
          {!showReplyInput ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-muted-foreground h-7 text-xs"
              onClick={() => setShowReplyInput(true)}
            >
              Reply
            </Button>
          ) : (
            <form onSubmit={handleSubmitReply} className="flex flex-col gap-2">
              <Textarea
                placeholder="Write a reply..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                rows={2}
                className="resize-none text-sm"
                autoFocus
              />
              <div className="flex gap-2">
                <Button type="submit" size="sm" className="gap-1">
                  <Send className="size-3" />
                  Reply
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowReplyInput(false);
                    setReplyText("");
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </div>
      )}
      {/* Replies with Facebook-style tree connector lines */}
      {comment.replies.length > 0 && (
        <div className="relative mt-2">
          {comment.replies.map((reply, index) => {
            const isFirst = index === 0;
            const isLast = index === comment.replies.length - 1;
            return (
              <div
                key={reply.id}
                className="relative pl-11 pt-3 first:pt-0"
              >
                {/* ╰ L-branch: vertical down to branch point + curve + horizontal to avatar */}
                <div
                  className="absolute border-l-2 border-b-2 border-gray-300 dark:border-gray-600 rounded-bl-lg"
                  style={{
                    left: 10,
                    top: isFirst ? -90 : 0,
                    width: 26,
                    height: isFirst ? 110 : 20,
                  }}
                  aria-hidden
                />
                {/* Vertical continuation to next reply (skip for last) */}
                {!isLast && (
                  <div
                    className="absolute bg-gray-300 dark:bg-gray-600"
                    style={{ left: 3, top: isFirst ? 20 : 20, bottom: 0, width: 2 }}
                    aria-hidden
                  />
                )}
                <SingleComment
                  author={reply.author}
                  body={reply.body}
                  timeAgo={reply.timeAgo}
                  isReply
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
