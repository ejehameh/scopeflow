"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, MoreHorizontal, Check, Trash2, Pencil, CheckCheck, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useComments } from "@/context/comments-context";
import { EmojiPicker } from "./emoji-picker";
import { MentionInput } from "./mention-input";
import type { Comment as CommentT } from "@/types/discussion";
import { CommentBody } from "./comment-body";
import { UserAvatar } from "@/components/user-avatar";

export function CommentPopup({ comment }: { comment: CommentT }) {
  const { addReply, editComment, deleteThread, toggleResolved, addReaction, closePopup } =
    useComments();
  const [replyText, setReplyText] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const menuBtnRef = useRef<HTMLButtonElement>(null);
  const threadRef = useRef<HTMLDivElement>(null);
  const prevReplyCount = useRef(comment.replies.length);

  useEffect(() => {
    if (comment.replies.length > prevReplyCount.current) {
      threadRef.current?.scrollTo({ top: threadRef.current.scrollHeight, behavior: "smooth" });
    }
    prevReplyCount.current = comment.replies.length;
  }, [comment.replies.length]);

  const startEdit = (id: string, body: string) => {
    setEditingId(id);
    setEditText(body);
  };
  const saveEdit = () => {
    if (!editingId) return;
    const isRoot = editingId === comment.id;
    editComment(comment.id, isRoot ? null : editingId, editText.trim());
    setEditingId(null);
    setEditText("");
  };
  const handleReply = () => {
    const t = replyText.trim();
    if (!t) return;
    addReply(comment.id, t);
    setReplyText("");
  };

  return (
    <div
      className="w-80 rounded-lg border border-border bg-popover shadow-xl"
      style={{ zIndex: 9999 }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border">
        <span className="text-sm font-semibold text-foreground">Comment</span>
        <div className="flex items-center gap-0.5">
          <Button ref={menuBtnRef} variant="ghost" size="icon-xs" onClick={() => setShowMenu(!showMenu)}>
            <MoreHorizontal className="size-4" />
          </Button>
          <PopupHeaderMenu
            open={showMenu}
            onClose={() => setShowMenu(false)}
            triggerRef={menuBtnRef}
            comment={comment}
            onResolve={() => { toggleResolved(comment.id); setShowMenu(false); }}
            onDelete={() => { deleteThread(comment.id); setShowMenu(false); }}
          />
          <Button variant="ghost" size="icon-xs" onClick={closePopup}>
            <X className="size-4" />
          </Button>
        </div>
      </div>

      {/* Thread */}
      <div ref={threadRef} className="max-h-64 overflow-y-auto p-3 space-y-3">
        <MessageBubble
          comment={comment}
          rootId={comment.id}
          id={comment.id}
          isEditing={editingId === comment.id}
          editText={editText}
          onEditTextChange={setEditText}
          onStartEdit={startEdit}
          onSaveEdit={saveEdit}
          onCancelEdit={() => setEditingId(null)}
          onReact={(emoji) => addReaction(comment.id, null, emoji)}
        />
        {comment.replies.map((r) => (
          <MessageBubble
            key={r.id}
            comment={r}
            rootId={comment.id}
            id={r.id}
            isEditing={editingId === r.id}
            editText={editText}
            onEditTextChange={setEditText}
            onStartEdit={startEdit}
            onSaveEdit={saveEdit}
            onCancelEdit={() => setEditingId(null)}
            onReact={(emoji) => addReaction(comment.id, r.id, emoji)}
          />
        ))}
      </div>

      {/* Reply input */}
      <div className="border-t border-border w-full justify-between p-2 flex items-center gap-2">
        <UserAvatar letter="S" size="sm" />
        <MentionInput
          value={replyText}
          onChange={setReplyText}
          placeholder="Reply"
          rows={1}
          className="text-sm flex-1 w-full min-h-[32px] py-1.5"
          onSubmit={handleReply}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          className="text-primary shrink-0"
          disabled={!replyText.trim()}
          onClick={handleReply}
        >
          <svg className="size-4" viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" /></svg>
        </Button>
      </div>
    </div>
  );
}

function PopupHeaderMenu({
  open,
  onClose,
  triggerRef,
  comment,
  onResolve,
  onDelete,
}: {
  open: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLElement | null>;
  comment: CommentT;
  onResolve: () => void;
  onDelete: () => void;
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
      <button
        type="button"
        className="w-full text-left px-2 py-1.5 text-sm rounded-sm hover:bg-accent flex items-center gap-2"
        onClick={onResolve}
      >
        {!comment.resolved ? <CheckCheck className="size-3.5" /> : <RotateCcw className="size-3.5" />}
        {comment.resolved ? "Reopen" : "Mark as resolved"}
      </button>
      <button
        type="button"
        className="w-full text-left px-2 py-1.5 text-sm rounded-sm hover:bg-destructive/10 text-destructive flex items-center gap-2"
        onClick={onDelete}
      >
        <Trash2 className="size-3.5" /> Delete thread...
      </button>
    </div>,
    document.body
  );
}

function MessageBubble({
  comment,
  rootId,
  id,
  isEditing,
  editText,
  onEditTextChange,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onReact,
}: {
  comment: CommentT;
  rootId: string;
  id: string;
  isEditing: boolean;
  editText: string;
  onEditTextChange: (v: string) => void;
  onStartEdit: (id: string, body: string) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onReact: (emoji: string) => void;
}) {
  const [showBubbleMenu, setShowBubbleMenu] = useState(false);
  const menuBtnRef = useRef<HTMLButtonElement>(null);

  return (
    <div className="group/bubble flex items-start gap-2">
      <UserAvatar letter={comment.author.avatarLetter} size="sm" className="mt-0.5" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">{comment.author.name}</span>
          <span className="text-xs text-muted-foreground">{comment.timeAgo}</span>
          <Button
            ref={menuBtnRef}
            variant="ghost"
            size="icon-xs"
            className="ml-auto opacity-0 group-hover/bubble:opacity-100 transition-opacity"
            onClick={() => setShowBubbleMenu(!showBubbleMenu)}
          >
            <MoreHorizontal className="size-3.5" />
          </Button>
          <BubbleEditMenu
            open={showBubbleMenu}
            onClose={() => setShowBubbleMenu(false)}
            triggerRef={menuBtnRef}
            onEdit={() => { onStartEdit(id, comment.body); setShowBubbleMenu(false); }}
          />
        </div>
        {isEditing ? (
          <div className="mt-1 space-y-1">
            <MentionInput value={editText} onChange={onEditTextChange} rows={2} className="text-sm" autoFocus onSubmit={onSaveEdit} />
            <div className="flex gap-1">
              <Button size="xs" onClick={onSaveEdit}>Save</Button>
              <Button size="xs" variant="ghost" onClick={onCancelEdit}>Cancel</Button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-foreground/90 mt-0.5"><CommentBody text={comment.body} /></p>
        )}
        {comment.reactions.length > 0 && (
          <div className="flex gap-1 mt-1 flex-wrap">
            {groupReactions(comment.reactions).map(({ emoji, count }) => (
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
        )}
        <div className="flex items-center gap-1 mt-1">
          <EmojiPicker onSelect={onReact} />
        </div>
      </div>
    </div>
  );
}

function BubbleEditMenu({
  open,
  onClose,
  triggerRef,
  onEdit,
}: {
  open: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLElement | null>;
  onEdit: () => void;
}) {
  const dropRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);

  useEffect(() => {
    if (!open || !triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    setPos({ top: rect.bottom + 4, left: Math.max(8, rect.right - 120) });
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
      className="fixed w-28 rounded-md border border-border bg-popover shadow-lg p-1"
      style={{ top: pos.top, left: pos.left, zIndex: 9999 }}
    >
      <button
        type="button"
        className="w-full text-left px-2 py-1.5 text-sm rounded-sm hover:bg-accent flex items-center gap-2"
        onClick={onEdit}
      >
        <Pencil className="size-3" /> Edit
      </button>
    </div>,
    document.body
  );
}

function groupReactions(reactions: { emoji: string; authorName: string }[]) {
  const map = new Map<string, number>();
  for (const r of reactions) map.set(r.emoji, (map.get(r.emoji) ?? 0) + 1);
  return Array.from(map, ([emoji, count]) => ({ emoji, count }));
}
