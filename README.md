# ScopeFlow

A collaborative Scope of Work review tool where agencies share SOW documents with clients, who can then annotate the PDF, leave threaded comments, and approve the scope — all in the browser.

## Running Locally

**Prerequisites:** Node.js >= 18 and npm.

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the landing page.

Other scripts:

| Command | Description |
|---|---|
| `npm run build` | Production build (Next.js + Turbopack) |
| `npm run start` | Serve the production build |
| `npm run lint` | Run Biome linter |
| `npm run format` | Auto-format with Biome |

## Pages

| Route | Purpose |
|---|---|
| `/` | Landing page — full PDF preview, project metadata, entry points to review or approve |
| `/review` | Three-column review workspace (thumbnail sidebar, PDF viewer with annotations, discussion panel) |
| `/approved` | Success screen with confetti animation after scope approval |

## Key Design Decisions

### React Context over external state libraries
All comment/annotation state lives in a single `CommentsContext`. For a scoped tool like this the data graph is simple (comments → replies → reactions), so React Context + `useCallback` keeps the bundle small and avoids adding Redux/Zustand overhead. Data is persisted to `localStorage` so comments survive refreshes.

### `react-pdf` with full page control instead of an `<iframe>`
The landing page uses a plain `<iframe>` for a quick read-only preview, but the review page renders each PDF page individually via `react-pdf`. This gives pixel-level control for overlaying annotation pins, text-selection highlights, and page-level comment borders — none of which are possible inside an iframe sandbox.

### Portal-based popups
Emoji pickers, mention dropdowns, comment popups, and context menus all render via `createPortal` to `document.body`. This avoids the clipping issues that come from nested `overflow: hidden` containers in the three-column layout and guarantees every floating element appears above the PDF content.

### CSS custom properties for theming
The app uses shadcn/ui's CSS variable system (`:root` / `.dark` selectors in `globals.css`) with a lightweight `ThemeProvider` that toggles the `dark` class on `<html>`. A blocking inline script in `<head>` reads the saved preference from `localStorage` before first paint to prevent a flash of the wrong theme.

### Percentage-based highlight coordinates
When a user selects text on the PDF, the bounding rectangles are converted to percentages relative to the page container (`rangeToPercentRects`). This makes highlights resolution-independent — they scale correctly whether the PDF is viewed on a phone or a wide monitor.

### Standalone vs annotation comments
Comments created from the discussion panel (`source: "standalone"`) are kept separate from PDF annotations (`source: "annotation"`). Standalone comments don't create pins on the PDF, but both types live in the same state array and are visible in the discussion panel, keeping the mental model simple.

## Assumptions

- **Single PDF per review session.** The current architecture assumes one document; multi-document support would need a routing/tab layer.
- **Two fixed personas.** The prototype hard-codes "Sarah" (agency) and "Alex" (client) without authentication. In production this would be replaced by a real auth system.
- **Client-side only storage.** `localStorage` is fine for a demo but wouldn't work for real collaboration where multiple people need to see the same comments.
- **Static PDF.** The SOW PDF (`/scope-of-work.pdf`) is served from `public/`. A real system would upload/store documents in a CDN or object store.
- **No concurrent editing.** There's no optimistic locking or conflict resolution — acceptable for a single-user demo.

## What I'd Tackle Next

1. **Real-time collaboration** — Replace `localStorage` with a backend (e.g. Supabase or a Next.js API route + database) and add WebSocket/SSE so multiple reviewers see comments appear live.
2. **Authentication & roles** — Proper login, invite links, and role-based permissions (viewer, commenter, approver).
3. **Freehand / area annotations** — Let users draw rectangles or freehand shapes on the PDF, not just select text, for marking up diagrams and images.
4. **Notification system** — Email or in-app notifications when someone replies to your comment or the scope gets approved.
5. **Version history** — Track multiple SOW revisions, show diffs, and let reviewers compare versions side-by-side.
6. **Mobile-responsive layout** — The current three-column layout is desktop-first; a bottom-sheet or tab-based UI would work better on narrow screens.
7. **Accessibility audit** — Add full keyboard navigation for annotation pins, ARIA live regions for new comments, and screen-reader-friendly PDF alternatives.
8. **Export & reporting** — Generate a PDF or summary of all comments/decisions to share outside the tool.
