"use client";

import { useEffect, useState } from "react";
import { Highlighter } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const STORAGE_KEY = "scopeflow-onboarding-seen";

export function OnboardingDialog() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      setOpen(true);
    }
  }, []);

  function handleDismiss() {
    localStorage.setItem(STORAGE_KEY, "true");
    setOpen(false);
  }

  return (
    <AlertDialog open={open} onOpenChange={(v) => !v && handleDismiss()}>
      <AlertDialogContent className="max-w-xl! md:min-w-[700px]">
        <AlertDialogHeader className="text-left">
          <AlertDialogTitle className="flex items-center justify-start gap-2">
            <div className="inline-flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary mb-1">
              <Highlighter className="size-5" />
            </div>
            Highlight text to comment
          </AlertDialogTitle>
          <AlertDialogDescription className="max-sm:text-center">
            Select any text or paragraph on the PDF to leave a comment pinned to
            that exact spot. Your team will see the highlight and can reply
            directly.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="rounded-lg overflow-hidden border border-border bg-black">
          <video
            src="/info-vid.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full"
          />
        </div>

        <AlertDialogFooter className="sm:justify-end">
          <AlertDialogAction onClick={handleDismiss} className="min-w-32">
            Got it
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
