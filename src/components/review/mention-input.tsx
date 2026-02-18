"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { useComments } from "@/context/comments-context";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface MentionInputProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
  rows?: number;
  onSubmit?: () => void;
}

export function MentionInput({
  value,
  onChange,
  placeholder,
  className,
  autoFocus,
  rows = 2,
  onSubmit,
}: MentionInputProps) {
  const { numPages } = useComments();
  const [showPicker, setShowPicker] = useState(false);
  const [pickerFilter, setPickerFilter] = useState("");
  const [pickerPos, setPickerPos] = useState<{ top: number; left: number } | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const pickerRef = useRef<HTMLDivElement>(null);

  const reposition = useCallback(() => {
    if (!textareaRef.current) return;
    const rect = textareaRef.current.getBoundingClientRect();
    const pickerH = 155;
    const fitsAbove = rect.top > pickerH + 0;
    setPickerPos({
      top: fitsAbove ? rect.top - pickerH - 4 : rect.bottom + 4,
      left: rect.left,
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const v = e.target.value;
    onChange(v);
    const cursor = e.target.selectionStart;
    const before = v.slice(0, cursor);
    const atMatch = before.match(/@(\w*)$/);
    if (atMatch) {
      setShowPicker(true);
      setPickerFilter(atMatch[1].toLowerCase());
      reposition();
    } else {
      setShowPicker(false);
    }
  };

  const insertMention = useCallback(
    (pageLabel: string) => {
      const ta = textareaRef.current;
      if (!ta) return;
      const cursor = ta.selectionStart;
      const before = value.slice(0, cursor);
      const after = value.slice(cursor);
      const atIdx = before.lastIndexOf("@");
      const newVal = `${before.slice(0, atIdx)}@${pageLabel} ${after}`;
      onChange(newVal);
      setShowPicker(false);
      ta.focus();
    },
    [value, onChange]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && !showPicker) {
      e.preventDefault();
      onSubmit?.();
    }
    if (e.key === "Escape") setShowPicker(false);
  };

  useEffect(() => {
    if (!showPicker) return;
    function handleClick(e: MouseEvent) {
      if (
        pickerRef.current && !pickerRef.current.contains(e.target as Node) &&
        textareaRef.current && !textareaRef.current.contains(e.target as Node)
      ) {
        setShowPicker(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showPicker]);

  const pages = Array.from({ length: numPages }, (_, i) => ({
    label: `Page ${i + 1}`,
    value: i + 1,
  })).filter((p) => p.label.toLowerCase().includes(pickerFilter));

  return (
    <div className="relative w-full">
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        rows={rows}
        autoFocus={autoFocus}
        className={cn("resize-none", className)}
      />
      {showPicker && pages.length > 0 && pickerPos &&
        createPortal(
          <div
            ref={pickerRef}
            className="fixed w-48 max-h-48 overflow-y-auto rounded-md border border-border bg-popover shadow-lg"
            style={{ top: pickerPos.top, left: pickerPos.left, zIndex: 9999 }}
          >
            <div className="p-1">
              <p className="px-2 py-1 text-xs font-medium text-muted-foreground">
                Mention a page
              </p>
              {pages.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  className="w-full text-left px-2 py-1.5 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    insertMention(p.label);
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
