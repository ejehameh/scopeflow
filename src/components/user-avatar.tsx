import { cn } from "@/lib/utils";

const AVATAR_COLORS: Record<string, { bg: string; text: string }> = {
  A: { bg: "bg-teal-700", text: "text-white" },
  S: { bg: "bg-red-800", text: "text-white" },
  B: { bg: "bg-indigo-700", text: "text-white" },
  C: { bg: "bg-amber-700", text: "text-white" },
  D: { bg: "bg-purple-700", text: "text-white" },
  E: { bg: "bg-emerald-700", text: "text-white" },
  F: { bg: "bg-rose-700", text: "text-white" },
};

const FALLBACK = { bg: "bg-slate-600", text: "text-white" };

function getColor(letter: string) {
  return AVATAR_COLORS[letter.toUpperCase()] ?? FALLBACK;
}

type AvatarSize = "xs" | "sm" | "md" | "lg";

const SIZE_CLASSES: Record<AvatarSize, string> = {
  xs: "size-5 text-[10px]",
  sm: "size-6 text-xs",
  md: "size-8 text-sm",
  lg: "size-9 text-xs",
};

interface UserAvatarProps {
  letter: string;
  size?: AvatarSize;
  className?: string;
  title?: string;
}

export function UserAvatar({ letter, size = "md", className, title }: UserAvatarProps) {
  const { bg, text } = getColor(letter);
  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center font-medium shrink-0",
        SIZE_CLASSES[size],
        bg,
        text,
        className
      )}
      title={title}
      aria-hidden
    >
      {letter.toUpperCase()}
    </div>
  );
}
