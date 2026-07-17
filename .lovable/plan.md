## Goal
Add an AI assist panel to the admin Project editor (`src/routes/_authenticated/admin.projects.$id.tsx`) that:
1. Shows the list of fields the editor expects.
2. Accepts a free-form "brain dump" (paste anything: notes, transcript, links, bullet points).
3. Calls an AI server function that returns structured JSON matching those fields.
4. Fills the form in-place (user reviews before saving — nothing is auto-saved).

Scope: admin project editor only. No public-page, schema, auth, or other-editor changes.

## UX

- New collapsible "AI Assist" card at the top of the editor (above Project Details).
- Two views inside:
  - **Checklist view** (default): shows every field the AI can fill (Title, Slug, Summary, Category, Roles, Tools, Timeframe, Live link, Case study link, Additional links, Image alt, Overview, Challenge, Goals, Constraints, Process, Solution, Results, Learnings, Metrics, SEO title, SEO description). Each row shows current fill state (empty / has value). A "Copy checklist" button copies a plain-text version the user can fill offline.
  - **Brain-dump view**: large textarea + "Fill fields with AI" button. Optional toggle "Overwrite existing values" (default off — only fills empty fields).
- After generation:
  - Diff preview: for each field the AI proposes, show current value vs proposed value with per-field "Apply" / "Skip" checkboxes and one "Apply selected" button.
  - Nothing writes to the DB — it just populates the form state. User still clicks Save Draft / Publish.
- Loading state uses a shimmer/spinner; errors surface as toast + inline message.
- Rate-limit (429) and credits-exhausted (402) errors show a clear message.

## Server function

New file `src/lib/cms/ai-assist.functions.ts`:

- `generateProjectFields = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth])`
- Input (zod): `{ brainDump: string (min 10), existing: partial current form values, overwrite: boolean }`
- Reads `LOVABLE_API_KEY` inside handler.
- Uses AI SDK via the shared Lovable gateway helper. Since we need OpenAI-quality structured output on a schema this large, build the provider with `{ structuredOutputs: true }` and call `openai/gpt-5.4-mini` (fast, cheap, good extraction). Fallback path parses `error.text` if `NoObjectGeneratedError` fires.
- Schema kept **flat and constraint-free** (per `ai-sdk-lovable-gateway` rules): all fields nullable strings / string arrays / small object arrays. Length caps live in the prompt, not the schema. Metrics = `Array<{ value, label, note }>` nullable. Additional links = `Array<{ label, url }>` nullable.
- System prompt: "You extract portfolio project case-study fields from unstructured notes. Only fill fields the notes actually support. Never invent metrics, dates, or URLs. Keep summary ≤ 200 chars. Slug is lowercase-hyphenated derived from title. Overview/Challenge/etc. plain markdown paragraphs. Return nulls for anything unknown."
- User message includes the brain dump plus (optionally) the current field values for context when `overwrite=false` so the model can skip filled fields.

## Shared gateway helper

New file `src/lib/ai-gateway.server.ts` containing the canonical `createLovableAiGatewayProvider` / run-id helpers from the `ai-sdk-lovable-gateway` knowledge (server-only). Reused by any future AI features.

## Client wiring

- New component `src/components/admin/ProjectAiAssist.tsx` — self-contained card. Props: `values` (current form snapshot) and `onApply(patch)` (parent merges into form state).
- The editor passes its current form values in and receives the diff-approved patch back. No changes to save/publish logic.
- Uses `useServerFn(generateProjectFields)` inside a `useMutation` (react-query already in use) for pending/error state.

## Dependencies

Verify installed via `bun add` in build mode:
- `ai`
- `@ai-sdk/openai-compatible`
- `zod` (already used)

No client-side AI SDK needed — server-only.

## Guardrails / non-goals

- No auto-save. AI output is a proposal, not a write.
- No image generation.
- No streaming — one-shot `generateText` with `Output.object`.
- No changes to case-study or blog editors (can be added later using the same helper).
- Doesn't touch the public site.

## Verification

- Missing `LOVABLE_API_KEY` returns a clear error surfaced in the panel.
- Brain dump with rich detail fills most fields; sparse input leaves fields null.
- "Overwrite existing values = off" preserves already-filled fields.
- Per-field Skip works — skipped fields don't change.
- Toggle Apply on a metrics/additional-links proposal correctly patches array fields.
- Save Draft after Apply persists the AI-filled values via the existing `saveProject` flow.
- 429 / 402 render friendly errors, not raw stack traces.

## Files touched
- new: `src/lib/ai-gateway.server.ts`
- new: `src/lib/cms/ai-assist.functions.ts`
- new: `src/components/admin/ProjectAiAssist.tsx`
- edited: `src/routes/_authenticated/admin.projects.$id.tsx` (mount the panel, wire `onApply` into existing form state)
- edited: `package.json` / `bun.lock` (add `ai`, `@ai-sdk/openai-compatible` if missing)