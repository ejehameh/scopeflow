"use client";

import dynamic from "next/dynamic";
import { ReviewLayout } from "./review-layout";

const PdfReviewView = dynamic(
  () =>
    import("./pdf-review-view").then((m) => ({
      default: m.PdfReviewView,
    })),
  { ssr: false }
);

export function ReviewPageClient() {
  return <ReviewLayout PdfReviewView={PdfReviewView} />;
}
