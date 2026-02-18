export interface CommentAuthor {
  name: string;
  role?: string; // e.g. "Logistics Co", "Team"
  avatarLetter: string;
}

export interface Comment {
  id: string;
  author: CommentAuthor;
  body: string;
  timeAgo: string;
  sectionId?: string; // optional: tie to document section
  replies: Comment[];
}
