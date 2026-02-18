"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import type { Comment, CommentAuthor, CommentHighlight, Reaction } from "@/types/discussion";

const ALEX: CommentAuthor = { name: "Alex", role: "Logistics Co", avatarLetter: "A" };
const SARAH: CommentAuthor = { name: "Sarah Miller", role: "Team", avatarLetter: "S" };

const SEED_COMMENTS: Comment[] = [
  {
    id: "seed-1",
    author: ALEX,
    body: "Can we add real-time tracking to Phase 2? Our warehouse needs to see where products are at all times.",
    timeAgo: "About 27 minutes ago",
    highlight: {
      pageNumber: 2,
      text: "Phase 2: Inventory Management",
      pinX: 85,
      pinY: 42,
      rects: [],
    },
    reactions: [],
    resolved: false,
    source: "annotation",
    replies: [
      {
        id: "seed-1-r1",
        author: SARAH,
        body: "Yes, we can include that. We've updated the scope in Phase 2. It will shift the timeline for that phase by 3 days.",
        timeAgo: "About 17 minutes ago",
        reactions: [],
        resolved: false,
        source: "annotation",
        replies: [],
      },
    ],
  },
];

interface CommentsContextValue {
  comments: Comment[];
  activePopupId: string | null;
  numPages: number;
  scrollContainerRef: RefObject<HTMLDivElement | null>;
  setNumPages: (n: number) => void;
  openPopup: (id: string) => void;
  closePopup: () => void;
  addComment: (body: string, highlight?: CommentHighlight) => void;
  addReply: (commentId: string, body: string) => void;
  editComment: (commentId: string, replyId: string | null, newBody: string) => void;
  deleteThread: (commentId: string) => void;
  toggleResolved: (commentId: string) => void;
  addReaction: (commentId: string, replyId: string | null, emoji: string) => void;
  scrollToHighlight: (commentId: string) => void;
  scrollToPage: (pageNumber: number) => void;
}

const CommentsContext = createContext<CommentsContextValue | null>(null);

const STORAGE_KEY = "scopeflow-comments";

function loadComments(): Comment[] {
  if (typeof window === "undefined") return SEED_COMMENTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Comment[];
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch { /* ignore corrupt data */ }
  return SEED_COMMENTS;
}

export function CommentsProvider({ children }: { children: ReactNode }) {
  const [comments, setComments] = useState<Comment[]>(loadComments);
  const [activePopupId, setActivePopupId] = useState<string | null>(null);
  const [numPages, setNumPages] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(comments));
    } catch { /* storage full or unavailable */ }
  }, [comments]);

  const addComment = useCallback((body: string, highlight?: CommentHighlight) => {
    const c: Comment = {
      id: String(Date.now()),
      author: ALEX,
      body,
      timeAgo: "Just now",
      highlight,
      reactions: [],
      resolved: false,
      source: highlight ? "annotation" : "standalone",
      replies: [],
    };
    setComments((prev) => [...prev, c]);
    if (highlight) setActivePopupId(c.id);
  }, []);

  const addReply = useCallback((commentId: string, body: string) => {
    const reply: Comment = {
      id: `${commentId}-${Date.now()}`,
      author: SARAH,
      body,
      timeAgo: "Just now",
      reactions: [],
      resolved: false,
      source: "annotation",
      replies: [],
    };
    setComments((prev) =>
      prev.map((c) => (c.id === commentId ? { ...c, replies: [...c.replies, reply] } : c))
    );
  }, []);

  const editComment = useCallback((commentId: string, replyId: string | null, newBody: string) => {
    setComments((prev) =>
      prev.map((c) => {
        if (c.id !== commentId) return c;
        if (!replyId) return { ...c, body: newBody };
        return { ...c, replies: c.replies.map((r) => (r.id === replyId ? { ...r, body: newBody } : r)) };
      })
    );
  }, []);

  const deleteThread = useCallback((commentId: string) => {
    setComments((prev) => prev.filter((c) => c.id !== commentId));
    setActivePopupId((id) => (id === commentId ? null : id));
  }, []);

  const toggleResolved = useCallback((commentId: string) => {
    setComments((prev) =>
      prev.map((c) => (c.id === commentId ? { ...c, resolved: !c.resolved } : c))
    );
  }, []);

  const addReaction = useCallback((commentId: string, replyId: string | null, emoji: string) => {
    const authorName = ALEX.name;
    setComments((prev) =>
      prev.map((c) => {
        if (c.id !== commentId) return c;
        const update = (reactions: Reaction[]) => {
          const existingSame = reactions.find((r) => r.emoji === emoji && r.authorName === authorName);
          if (existingSame) return reactions.filter((r) => r !== existingSame);
          const withoutPrev = reactions.filter((r) => r.authorName !== authorName);
          return [...withoutPrev, { emoji, authorName }];
        };
        if (!replyId) return { ...c, reactions: update(c.reactions) };
        return { ...c, replies: c.replies.map((r) => (r.id === replyId ? { ...r, reactions: update(r.reactions) } : r)) };
      })
    );
  }, []);

  const scrollToHighlight = useCallback((commentId: string) => {
    setComments((prev) => {
      const comment = prev.find((c) => c.id === commentId);
      if (!comment?.highlight) return prev;
      const pageEl = document.getElementById(`pdf-page-${comment.highlight.pageNumber}`);
      pageEl?.scrollIntoView({ behavior: "smooth", block: "start" });
      return prev;
    });
    setActivePopupId(commentId);
  }, []);

  const scrollToPage = useCallback((pageNumber: number) => {
    const pageEl = document.getElementById(`pdf-page-${pageNumber}`);
    pageEl?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <CommentsContext.Provider
      value={{
        comments,
        activePopupId,
        numPages,
        scrollContainerRef,
        setNumPages,
        openPopup: setActivePopupId,
        closePopup: () => setActivePopupId(null),
        addComment,
        addReply,
        editComment,
        deleteThread,
        toggleResolved,
        addReaction,
        scrollToHighlight,
        scrollToPage,
      }}
    >
      {children}
    </CommentsContext.Provider>
  );
}

export function useComments() {
  const ctx = useContext(CommentsContext);
  if (!ctx) throw new Error("useComments must be used within CommentsProvider");
  return ctx;
}
