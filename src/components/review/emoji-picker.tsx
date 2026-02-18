"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { Smile } from "lucide-react";
import { Button } from "@/components/ui/button";

const QUICK_EMOJIS = ["👍", "👎", "❤️", "😂", "🎉", "🤔", "👀", "🔥"];

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
}

export function EmojiPicker({ onSelect }: EmojiPickerProps) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const pickerRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);

  const reposition = useCallback(() => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const pickerH = 40;
    const fitsAbove = rect.top > pickerH + 8;
    setPos({
      top: fitsAbove ? rect.top - pickerH - 4 : rect.bottom + 4,
      left: Math.max(8, rect.right - 110),
    });
  }, []);

  useEffect(() => {
    if (!open) return;
    reposition();
    function handleClick(e: MouseEvent) {
      if (
        pickerRef.current && !pickerRef.current.contains(e.target as Node) &&
        btnRef.current && !btnRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open, reposition]);

  return (
    <>
      <Button
        ref={btnRef}
        type="button"
        variant="ghost"
        size="icon-xs"
        className="text-muted-foreground"
        onClick={() => setOpen(!open)}
      >
        <Smile className="size-3.5" />
      </Button>
      {open && pos &&
        createPortal(
          <div
            ref={pickerRef}
            className="fixed rounded-md border border-border bg-popover shadow-lg p-1.5 flex gap-1"
            style={{ top: pos.top, left: pos.left, zIndex: 9999 }}
          >
            {QUICK_EMOJIS.map((e) => (
              <button
                key={e}
                type="button"
                className="text-bas cursor-pointer hover:scale-125 transition-transform p-0.5"
                onClick={() => { onSelect(e); setOpen(false); }}
              >
                {e}
              </button>
            ))}
          </div>,
          document.body
        )}
    </>
  );
}
