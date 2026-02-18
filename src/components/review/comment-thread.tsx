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
    <div className={cn("flex gap-3", isReply && "ml-11")}>
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
        <p className="text-sm text-foreground/90 mt-0.5">{body}</p>
        <p className="text-xs text-muted-foreground mt-1">{timeAgo}</p>
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
    <div className="flex flex-col gap-4">
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
      {comment.replies.length > 0 && (
        <div className="flex flex-col gap-4 border-l-2 border-muted pl-4 ml-4">
          {comment.replies.map((reply) => (
            <SingleComment
              key={reply.id}
              author={reply.author}
              body={reply.body}
              timeAgo={reply.timeAgo}
              isReply
            />
          ))}
        </div>
      )}
    </div>
  );
}
