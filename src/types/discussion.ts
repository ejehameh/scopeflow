export interface CommentAuthor {
  name: string;
  role?: string;
  avatarLetter: string;
}

export interface Reaction {
  emoji: string;
  authorName: string;
}

/** Bounding box of the highlighted text, as percentages of the page dimensions */
export interface HighlightRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CommentHighlight {
  pageNumber: number;
  text: string;
  pinX: number;
  pinY: number;
  rects: HighlightRect[];
}

export interface Comment {
  id: string;
  author: CommentAuthor;
  body: string;
  timeAgo: string;
  highlight?: CommentHighlight;
  reactions: Reaction[];
  resolved: boolean;
  source: "annotation" | "standalone";
  replies: Comment[];
}
