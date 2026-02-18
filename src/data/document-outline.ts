export interface DocumentSection {
  id: string;
  label: string;
}

/** Table of contents for the Scope of Work document (matches PDF structure). */
export const DOCUMENT_OUTLINE: DocumentSection[] = [
  { id: "introduction", label: "Introduction" },
  { id: "phase-1", label: "Phase 1: Discovery" },
  { id: "phase-2", label: "Phase 2: Development" },
  { id: "phase-3", label: "Phase 3: Deployment" },
];
