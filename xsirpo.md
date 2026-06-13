# MnemoScope — Codex Build Brief

> **Tagline:** Replay your thoughts. Rediscover your ideas.

Build **MnemoScope**, a beautiful local-first desktop app that turns notes, screenshots, voice thoughts, PDFs, code snippets, and saved links into a cinematic memory timeline. The app should feel like a personal research archive, a sci-fi dashboard, and a powerful second brain in one polished product.

This should not feel like a generic starter app. It should feel like something crafted with taste.

---

## 1. Core Idea

MnemoScope is a **cinematic memory timeline** for a person's thinking.

The user should be able to drop in files, write notes, record voice thoughts, import screenshots, and later browse everything as if they are scrubbing through a movie of their own ideas. Every captured item becomes a beautiful memory card on a timeline.

The main experience should answer questions like:

- What was I thinking about last night?
- Where is that screenshot I saved for the project?
- What did I say in that voice note?
- Turn this messy day into a clean project plan.
- Show me all memories related to this idea.

The app is not just a notes app. It is a **memory replay system**.

---

## 2. Repo Instruction: Match My Existing NextChat Style

Before building anything, inspect the existing repository carefully.

Pay special attention to the project called or styled like **NextChat** in my repo. Use it as the taste reference for:

- visual polish
- component structure
- spacing rhythm
- dark/light styling decisions
- sidebar behavior
- chat-like interaction patterns
- motion style
- typography scale
- button and card design
- README quality
- naming conventions
- folder organization

Do **not** blindly copy unrelated code. Instead, make MnemoScope feel like it belongs in the same universe as that NextChat project.

If the repo already has shared components, theme tokens, utility classes, icons, layout patterns, or README conventions, reuse them where appropriate.

The final result should feel like:

> “This was made by the same person who made the NextChat project, but it is a completely new, more cinematic product.”

---

## 3. Product Personality

MnemoScope should feel:

- cinematic
- elegant
- powerful
- fast
- private
- slightly futuristic
- calm, not cluttered
- visually rich but still usable
- polished enough for screenshots

Avoid a cold enterprise dashboard look. Avoid random template UI. Avoid boring forms everywhere.

Think:

- glowing memory cards
- glass panels
- soft depth
- smooth timeline scrubbing
- elegant empty states
- intelligent command palette
- subtle animations
- beautiful dark mode
- highly readable previews

---

## 4. Required App Name and Branding

App name:

# **MnemoScope**

Tagline:

> Replay your thoughts. Rediscover your ideas.

The app must have its own original logo, icon, and brand identity.

### Logo Requirements

Create an original logo, not a placeholder.

Suggested concept:

- a stylized **M** shaped like a memory wave
- a circular lens/scope around it
- a small timeline arc or orbit passing through it
- should work as an app icon and as a header logo

Deliver brand assets in a clear folder, for example:

```text
src/assets/brand/
  mnemoscope-logo.svg
  mnemoscope-mark.svg
  mnemoscope-icon.svg
  mnemoscope-wordmark.svg
  README.md
```

Also add app icons in the correct desktop-app icon locations if the stack supports them.

The logo should look premium and minimal. It should not look like a random AI-generated icon.

---

## 5. Suggested Tech Stack

Use the stack that best fits the existing repo. Prefer matching the current repo’s conventions over forcing a new stack.

If starting fresh or if the repo supports it, use:

- **Tauri v2** for the desktop shell
- **React + TypeScript** for the UI
- **Vite** for frontend tooling
- **Tailwind CSS** for styling
- **Framer Motion** or a similar motion library for refined animations
- **SQLite** for local storage
- **Drizzle ORM** or a simple typed database layer
- **PDF.js** for PDF text extraction and previews
- **Web Speech API** for voice note transcription where supported
- **Fuse.js or SQLite FTS5** for local search
- Optional: an embeddings provider abstraction for semantic search later

Important: keep the architecture clean enough that semantic search can be upgraded later without rewriting the whole app.

---

## 6. MVP Scope

Build a polished MVP, not a half-finished huge product.

The MVP must include:

1. A stunning landing/home screen inside the app.
2. A cinematic timeline view.
3. Add memory manually as a note.
4. Import files by drag and drop.
5. Basic file indexing for text, markdown, code files, and PDFs.
6. Image/screenshot memory cards.
7. Voice note capture or a graceful fallback if unsupported.
8. Local search across memory titles, content, file names, tags, and transcripts.
9. Day summary generation using a provider abstraction.
10. Project brief export to Markdown.
11. Local SQLite persistence.
12. Elegant README with screenshots/placeholders and clear usage instructions.
13. Proper logo and app icon.

Do not ship a toy. The app should feel coherent even if some advanced features are marked as future work.

---

## 7. Core Screens

### 7.1 Home / Command Center

The opening screen should feel powerful immediately.

It should include:

- beautiful hero section with the MnemoScope logo
- today’s memory count
- quick add buttons
- search bar / command palette entry
- recent memory cards
- “Replay Today” call-to-action
- subtle animated background

The first impression matters a lot.

### 7.2 Cinematic Timeline

This is the heart of the app.

The timeline should allow the user to browse memories by time.

Required behavior:

- grouped by day
- smooth horizontal or vertical scrolling
- memory cards arranged with visual hierarchy
- different card styles for note, voice, image, PDF, code, and link
- preview on hover or click
- keyboard navigation
- filter by type
- filter by tag
- jump to today
- polished empty states

A memory card should contain:

- title
- type badge
- time
- short preview
- tags
- small visual thumbnail when available
- quick actions: open, summarize, export, delete

### 7.3 Memory Detail View

Clicking a memory opens a detail panel.

It should show:

- title
- created time
- source type
- full extracted text or note body
- file preview if available
- tags
- linked memories
- summary
- action buttons

The detail panel should feel like opening a memory capsule.

### 7.4 Capture Screen

The capture screen should make adding thoughts fast.

Include:

- note editor
- title field
- tag input
- type selector
- voice capture button
- drag-and-drop file zone
- save button

The editor should be pleasant to write in.

### 7.5 Search / Ask Memory

Build a search page or command palette.

For MVP, search can be local keyword/FTS search. Design the code so semantic search can be added later.

Search results should be visually rich, not just a plain list.

Each result should show:

- title
- type
- date
- highlighted match if possible
- preview text
- quick open action

### 7.6 Project Brief Export

The user should be able to select memories and export them as a clean Markdown project brief.

The exported brief should include:

- project title
- selected memories
- timeline of relevant events
- key notes
- useful files
- extracted decisions
- next steps

If an AI provider is configured, allow a polished generated brief. If not, generate a structured non-AI version.

---

## 8. Data Model

Create a clean local data model.

Suggested SQLite tables:

### `memories`

- `id`
- `title`
- `type` — note, voice, image, pdf, code, link, file
- `content`
- `summary`
- `source_path`
- `thumbnail_path`
- `created_at`
- `updated_at`
- `captured_at`
- `metadata_json`

### `tags`

- `id`
- `name`
- `color`

### `memory_tags`

- `memory_id`
- `tag_id`

### `memory_links`

- `source_memory_id`
- `target_memory_id`
- `reason`

### `settings`

- `key`
- `value`

Use migrations if the repo already has a migration pattern.

---

## 9. File Import Behavior

The app should support drag-and-drop import.

Required file support:

- `.txt`
- `.md`
- `.js`, `.ts`, `.tsx`, `.py`, `.rs`, `.cpp`, `.java`, `.css`, `.html`, `.json`
- `.pdf`
- image files such as `.png`, `.jpg`, `.jpeg`, `.webp`

Behavior:

- store metadata
- extract text when possible
- generate preview/thumbnail when possible
- create a memory card automatically
- allow the user to edit title and tags after import

For unsupported files, still create a file memory with metadata and a useful preview state.

---

## 10. Voice Note Behavior

Voice notes should be quick and satisfying.

Build:

- record button
- recording state animation
- waveform-like visual
- transcription if available
- fallback manual text entry if speech recognition is unavailable

The saved voice memory should include:

- title
- transcript
- duration if available
- created time
- tags

Do not let unsupported browser APIs break the app. Graceful fallback is required.

---

## 11. AI Integration

Do not hard-code one provider deeply into the app.

Create a clean provider abstraction.

Example:

```text
src/lib/ai/
  provider.ts
  localFallback.ts
  openaiProvider.ts
  summaryPrompts.ts
```

MVP behavior:

- If no API key is configured, summaries should still work using a simple extractive local fallback.
- If an API key is configured, allow richer summaries and project brief generation.

Required AI actions:

- summarize one memory
- summarize a day
- generate project brief from selected memories
- suggest tags

The UI should be clear when AI features require configuration.

Do not add exaggerated AI claims in the README.

---

## 12. UI Design Direction

The UI must be one of the strongest parts of this project.

### Visual Style

Use:

- premium dark mode first
- optional light mode if quick to support
- glass-like cards
- soft borders
- subtle gradients
- cinematic shadows
- precise spacing
- clean typography
- responsive layouts
- tasteful animation

Avoid:

- generic SaaS dashboard look
- random neon overload
- unreadable low contrast
- cluttered sidebars
- placeholder-looking cards
- unstyled form controls

### Main Layout

Suggested layout:

- left sidebar for navigation
- top command/search bar
- central cinematic timeline canvas
- right-side memory detail drawer

Navigation items:

- Today
- Timeline
- Capture
- Search
- Projects
- Settings

### Motion

Use animation meaningfully:

- memory cards fade/slide in
- timeline scrubber glides smoothly
- detail drawer opens like a capsule
- command palette appears gracefully
- import dropzone responds to drag
- voice recording pulses softly

Do not make the UI slow or distracting.

---

## 13. Component Suggestions

Create reusable components such as:

```text
src/components/brand/Logo.tsx
src/components/layout/AppShell.tsx
src/components/layout/Sidebar.tsx
src/components/layout/TopCommandBar.tsx
src/components/memory/MemoryCard.tsx
src/components/memory/MemoryDetailDrawer.tsx
src/components/memory/MemoryTypeBadge.tsx
src/components/timeline/TimelineView.tsx
src/components/timeline/TimelineDayGroup.tsx
src/components/capture/CaptureComposer.tsx
src/components/search/SearchCommand.tsx
src/components/export/ProjectBriefDialog.tsx
src/components/ui/GlassPanel.tsx
src/components/ui/EmptyState.tsx
```

If the repo already has UI components, reuse or extend them instead of creating duplicates.

---

## 14. Settings Screen

Add a simple but polished settings screen.

Include:

- theme preference
- data location display
- AI provider/API key configuration if implemented
- import/export database option if reasonable
- reset demo data option
- app version

Do not overbuild settings. Keep it clean.

---

## 15. Demo Data

Include tasteful demo data so the app looks alive when first opened.

Demo memories should include:

- one note
- one screenshot/image memory
- one PDF-like memory
- one voice-note-like memory
- one code snippet
- one project idea

Make the demo data feel natural and human-written.

No robotic placeholder text like:

- Lorem ipsum
- Sample item 1
- Test memory
- AI generated content

---

## 16. Exported Markdown Format

When exporting a project brief, produce elegant Markdown like this:

```md
# Project Brief: <Project Name>

## Why this matters

<Short human explanation>

## Timeline

- <Date/time> — <memory title>
- <Date/time> — <memory title>

## Key Ideas

- ...

## Useful References

- ...

## Decisions

- ...

## Next Steps

- [ ] ...
- [ ] ...
```

The exported Markdown should be clean enough to paste directly into a GitHub README, Notion, Obsidian, or a research notebook.

---

## 17. README Requirements

Create a beautiful and elegant `README.md`.

The README should feel written by a careful human, not by a template generator.

It must include:

1. Project title and logo
2. Short poetic tagline
3. Clean description
4. Screenshot section
5. Feature highlights
6. Why MnemoScope exists
7. Tech stack
8. Installation
9. Development setup
10. Building the desktop app
11. Project structure
12. Privacy/local-first note
13. Roadmap
14. License section

Use tasteful formatting.

The README should include screenshot placeholders if screenshots are not available yet, for example:

```md
![MnemoScope timeline preview](./docs/screenshots/timeline-preview.png)
```

If possible, generate real screenshots of the running app and place them in:

```text
docs/screenshots/
```

The README should not contain phrases like:

- generated by AI
- made with ChatGPT
- this was automatically created
- as an AI language model
- boilerplate

Keep the language natural, elegant, and confident.

---

## 18. Suggested README Opening

Use or adapt this tone:

```md
# MnemoScope

<p align="center">
  <img src="./src/assets/brand/mnemoscope-logo.svg" alt="MnemoScope" width="120" />
</p>

<p align="center">
  <strong>Replay your thoughts. Rediscover your ideas.</strong>
</p>

MnemoScope is a cinematic memory timeline for notes, screenshots, voice thoughts, PDFs, code snippets, and saved links. It helps you revisit the shape of your thinking, recover forgotten ideas, and turn scattered moments into clear project direction.
```

Make the final README better than this if the repo style suggests a stronger direction.

---

## 19. Git and Commit Instructions

Make clean, separate commits. Do not dump everything into one commit.

Suggested commit sequence:

1. `Initialize MnemoScope desktop app structure`
2. `Add MnemoScope branding and app shell`
3. `Create local memory database and models`
4. `Build capture and import flow`
5. `Implement cinematic timeline view`
6. `Add memory detail and search experience`
7. `Add project brief export`
8. `Polish UI motion and empty states`
9. `Write elegant README and project documentation`
10. `Prepare desktop build and release assets`

Use natural commit messages. Do not mention AI tools in commit messages.

---

## 20. Deployment / Publishing

If the repo supports GitHub Pages or a web preview, add a polished landing/demo page for MnemoScope.

The landing page should include:

- logo
- tagline
- short product description
- feature cards
- screenshots
- local-first privacy note
- download/build instructions

If GitHub Pages is available, configure deployment.

If this is primarily a desktop app, still make the README and screenshots strong enough that the GitHub repo looks polished.

---

## 21. Quality Bar

Before finishing, verify:

- app runs locally
- no broken imports
- no TypeScript errors
- no obvious console errors
- timeline has demo memories
- drag-and-drop works
- search returns results
- exported Markdown is clean
- README is elegant
- logo files exist
- app icon exists
- UI looks premium in screenshots
- project structure is understandable

Run the available checks:

```bash
npm install
npm run lint
npm run typecheck
npm run build
```

Use the actual package manager used by the repo. If it uses `pnpm`, `bun`, or `yarn`, follow that instead of forcing npm.

---

## 22. Important Writing and Style Rules

For code comments, README, commit messages, and visible text:

- Keep everything natural and human-written.
- Avoid robotic phrasing.
- Avoid generic template language.
- Avoid exaggerated marketing claims.
- Do not mention AI assistance.
- Do not write anything that sounds like it was automatically generated.
- Prefer concise, elegant language.

Every visible sentence should feel intentional.

---

## 23. Stretch Goals

Only add these after the MVP feels polished:

- graph view of connected memories
- semantic embeddings search
- Obsidian import/export
- browser clipper
- global hotkey capture
- automatic screenshot capture
- calendar-style memory map
- local LLM support
- encrypted vault mode
- theme editor
- cloud sync as an optional feature

Do not sacrifice MVP polish for stretch goals.

---

## 24. Final Deliverables

Deliver:

- working MnemoScope app
- original logo and icon
- local database layer
- memory capture/import flow
- cinematic timeline UI
- search experience
- export-to-Markdown feature
- elegant README
- screenshot assets or screenshot placeholders
- clean commit history
- optional GitHub Pages/demo deployment if the repo supports it

The final project should look good enough that someone opening the repo immediately understands the idea and wants to try it.

---

## 25. North Star

The goal is not to build another notes app.

The goal is to build a place where scattered thoughts feel alive again.

MnemoScope should make the user feel like their ideas are not lost in files, screenshots, and random notes — they are part of a cinematic timeline that can be replayed, searched, and turned into something real.
