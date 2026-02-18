"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import type { Comment } from "@/types/discussion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Send, MoreHorizontal, Pencil, Trash2, Check, CheckCheck, BookOpen, RotateCcw } from "lucide-react";
import { useComments } from "@/context/comments-context";
import { EmojiPicker } from "./emoji-picker";
import { MentionInput } from "./mention-input";
import { CommentBody } from "./comment-body";
import { UserAvatar } from "@/components/user-avatar";

function ReactionBar({ reactions, onReact }: { reactions: Comment["reactions"]; onReact: (emoji: string) => void }) {
  if (reactions.length === 0) return null;
  const grouped = new Map<string, number>();
  for (const r of reactions) grouped.set(r.emoji, (grouped.get(r.emoji) ?? 0) + 1);
  return (
    <div className="flex gap-1 mt-2 flex-wrap">
      {Array.from(grouped, ([emoji, count]) => (
        <button
          key={emoji}
          type="button"
          className="text-xs border border-border rounded-full px-1.5 py-0.5 hover:bg-accent"
          onClick={() => onReact(emoji)}
        >
          {emoji} {count}
        </button>
      ))}
    </div>
  );
}

/**
 * Portal-based dropdown menu that positions itself relative to a trigger
 * element, never clipped by overflow containers.
 */
function PortalDropdown({
  open,
  onClose,
  triggerRef,
  children,
}: {
  open: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLElement | null>;
  children: React.ReactNode;
}) {
  const dropRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);

  useEffect(() => {
    if (!open || !triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    setPos({ top: rect.bottom + 4, left: Math.max(8, rect.right - 180) });
    function handleClick(e: MouseEvent) {
      if (
        dropRef.current && !dropRef.current.contains(e.target as Node) &&
        triggerRef.current && !triggerRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open, onClose, triggerRef]);

  if (!open || !pos) return null;
  return createPortal(
    <div
      ref={dropRef}
      className="fixed w-44 rounded-md border border-border bg-popover shadow-lg p-1"
      style={{ top: pos.top, left: pos.left, zIndex: 9999 }}
    >
      {children}
    </div>,
    document.body
  );
}

function SingleComment({
  comment,
  rootId,
  isReply,
  isRoot,
}: {
  comment: Comment;
  rootId: string;
  isReply?: boolean;
  isRoot?: boolean;
}) {
  const { editComment, addReaction, deleteThread, toggleResolved } = useComments();
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.body);
  const [showMenu, setShowMenu] = useState(false);
  const menuBtnRef = useRef<HTMLButtonElement>(null);

  const rootComment = isRoot ? comment : null;

  const saveEdit = () => {
    editComment(rootId, isReply ? comment.id : null, editText.trim());
    setIsEditing(false);
  };

  return (
    <div className={cn("group/comment flex gap-3", isReply && "items-start")}>
      <UserAvatar letter={comment.author.avatarLetter} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-foreground">
            {comment.author.name}
            {comment.author.role && (
              <span className="text-muted-foreground font-normal"> ({comment.author.role})</span>
            )}
          </p>
          <div className="flex items-center gap-2 ml-auto">
            {comment.resolved && (
              <div className="text-xs ml-auto bg-green-500/10 px-2 py-0.5 rounded-full text-green-600 font-medium flex items-center gap-1">
                <CheckCheck className="size-3" /> Resolved
              </div>
            )}
            <Button
              ref={menuBtnRef}
              variant="ghost"
              size="icon-xs"
              className="ml-auto opacity-0 group-hover/comment:opacity-100 transition-opacity"
              onClick={() => setShowMenu(!showMenu)}
            >
              <MoreHorizontal className="size-3.5" />
            </Button>
          </div>
          <PortalDropdown open={showMenu} onClose={() => setShowMenu(false)} triggerRef={menuBtnRef}>
            <button
              type="button"
              className="w-full text-left px-2 py-1.5 text-sm rounded-sm hover:bg-accent flex items-center gap-2"
              onClick={() => { setIsEditing(true); setEditText(comment.body); setShowMenu(false); }}
            >
              <Pencil className="size-3.5" /> Edit
            </button>
            {isRoot && rootComment && (
              <>
                <button
                  type="button"
                  className="w-full text-left px-2 py-1.5 text-sm rounded-sm hover:bg-accent flex items-center gap-2"
                  onClick={() => { toggleResolved(rootId); setShowMenu(false); }}
                >
                  {!rootComment.resolved ? <CheckCheck className="size-3.5" /> : <RotateCcw className="size-3.5" />}
                  {rootComment.resolved ? "Reopen" : "Resolve"}
                </button>
                <button
                  type="button"
                  className="w-full text-left px-2 py-1.5 text-sm rounded-sm hover:bg-destructive/10 text-destructive flex items-center gap-2"
                  onClick={() => { deleteThread(rootId); setShowMenu(false); }}
                >
                  <Trash2 className="size-3.5" /> Delete thread
                </button>
              </>
            )}
          </PortalDropdown>
        </div>
        {isEditing ? (
          <div className="mt-1.5 space-y-1">
            <MentionInput value={editText} onChange={setEditText} rows={2} className="text-sm" autoFocus onSubmit={saveEdit} />
            <div className="flex gap-1">
              <Button size="xs" onClick={saveEdit}>Save</Button>
              <Button size="xs" variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
            </div>
          </div>
        ) : (
          <div
            className={cn(
              "mt-1.5 rounded-2xl px-4 py-2.5 text-sm text-foreground",
              "bg-muted/90 border border-border/80 shadow-sm",
              "rounded-tl-md"
            )}
          >
            <CommentBody text={comment.body} />
          </div>
        )}
        <ReactionBar reactions={comment.reactions} onReact={(emoji) => addReaction(rootId, isReply ? comment.id : null, emoji)} />
        <div className="flex items-center gap-1">
          <p className="text-xs text-muted-foreground">{comment.timeAgo}</p>
          <EmojiPicker onSelect={(emoji) => addReaction(rootId, isReply ? comment.id : null, emoji)} />
        </div>
      </div>
    </div>
  );
}

interface CommentThreadProps {
  comment: Comment;
}

export function CommentThread({ comment }: CommentThreadProps) {
  const { addReply, scrollToHighlight } = useComments();
  const [replyText, setReplyText] = useState("");
  const [showReplyInput, setShowReplyInput] = useState(false);

  const handleSubmitReply = () => {
    const trimmed = replyText.trim();
    if (!trimmed) return;
    addReply(comment.id, trimmed);
    setReplyText("");
    setShowReplyInput(false);
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Highlight reference badge — scrolls PDF to the annotation and opens its popup */}
      {comment.highlight && (
        <button
          type="button"
          className="flex items-center gap-1.5 text-xs text-primary bg-primary/5 border border-primary/20 rounded-md px-2 py-1 w-fit hover:bg-primary/10 transition-colors"
          onClick={() => scrollToHighlight(comment.id)}
        >
          <span className="font-medium">Page {comment.highlight.pageNumber}</span>
          <span className="text-muted-foreground truncate max-w-[180px]">
            &ldquo;{comment.highlight.text.slice(0, 40)}{comment.highlight.text.length > 40 ? "..." : ""}&rdquo;
          </span>
        </button>
      )}

      <SingleComment comment={comment} rootId={comment.id} isRoot />

      {/* Reply button / input */}
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
          <div className="flex flex-col gap-2">
            <MentionInput
              value={replyText}
              onChange={setReplyText}
              placeholder="Write a reply..."
              rows={2}
              className="text-sm"
              autoFocus
              onSubmit={handleSubmitReply}
            />
            <div className="flex gap-2">
              <Button size="sm" className="gap-1" onClick={handleSubmitReply}>
                <Send className="size-3" /> Reply
              </Button>
              <Button variant="ghost" size="sm" onClick={() => { setShowReplyInput(false); setReplyText(""); }}>
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Replies with Facebook-style tree connector lines */}
      {comment.replies.length > 0 && (
        <div className="relative mt-2">
          {comment.replies.map((reply, index) => {
            const isFirst = index === 0;
            const isLast = index === comment.replies.length - 1;
            return (
              <div key={reply.id} className="relative pl-11 pt-3 first:pt-0">
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
                {!isLast && (
                  <div
                    className="absolute bg-gray-300 dark:bg-gray-600"
                    style={{ left: 10, top: isFirst ? 20 : 20, bottom: 0, width: 2 }}
                    aria-hidden
                  />
                )}
                <SingleComment comment={reply} rootId={comment.id} isReply />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
