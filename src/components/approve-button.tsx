"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

const APPROVAL_DELAY_MS = 2000;

interface ApproveButtonProps {
  className?: string;
  size?: "default" | "sm" | "lg" | "icon" | "icon-sm" | "icon-lg" | "xs";
  variant?: "default" | "outline" | "secondary" | "ghost" | "destructive" | "link";
  children?: React.ReactNode;
}

export function ApproveButton({
  className,
  size = "default",
  variant = "default",
  children,
}: ApproveButtonProps) {
  const [isApproving, setIsApproving] = useState(false);
  const router = useRouter();

  const handleClick = () => {
    if (isApproving) return;
    setIsApproving(true);
    setTimeout(() => {
      router.push("/approved");
    }, APPROVAL_DELAY_MS);
  };

  return (
    <Button
      type="button"
      size={size}
      variant={variant}
      className={className}
      onClick={handleClick}
      disabled={isApproving}
    >
      {isApproving ? (
        <>
          <Loader2 className="size-4 animate-spin" />
          Approving…
        </>
      ) : (
        children ?? (
          <>
            <CheckCheck className="size-4" />
            Approve Scope
          </>
        )
      )}
    </Button>
  );
}
