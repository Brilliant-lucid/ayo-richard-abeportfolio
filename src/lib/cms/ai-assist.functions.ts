import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { generateText, Output, NoObjectGeneratedError } from "ai";
import { z } from "zod";

const InputSchema = z.object({
  brainDump: z.string().min(10, "Add a bit more detail"),
  existing: z.record(z.any()).optional(),
  overwrite: z.boolean().optional(),
});

// Flat, constraint-free schema. Length caps live in the prompt.
const FieldsSchema = z.object({
  title: z.string().nullable(),
  slug: z.string().nullable(),
  summary: z.string().nullable(),
  category: z.string().nullable(),
  roles: z.array(z.string()).nullable(),
  tools: z.array(z.string()).nullable(),
  start_date: z.string().nullable(),
  end_date: z.string().nullable(),
  ongoing: z.boolean().nullable(),
  live_link: z.string().nullable(),
  case_study_link: z.string().nullable(),
  additional_links: z
    .array(z.object({ label: z.string(), url: z.string() }))
    .nullable(),
  image_alt: z.string().nullable(),
  overview: z.string().nullable(),
  challenge: z.string().nullable(),
  goals: z.string().nullable(),
  constraints: z.string().nullable(),
  process: z.string().nullable(),
  solution: z.string().nullable(),
  results: z.string().nullable(),
  learnings: z.string().nullable(),
  metrics: z
    .array(z.object({ value: z.string(), label: z.string(), note: z.string() }))
    .nullable(),
  seo_title: z.string().nullable(),
  seo_description: z.string().nullable(),
});

export type AiAssistFields = z.infer<typeof FieldsSchema>;

const SYSTEM_PROMPT = `You extract structured portfolio project case-study fields from unstructured notes (brain dumps, transcripts, bullet points).

Rules:
- Only fill fields that the notes actually support. Return null for anything unknown — never invent metrics, dates, URLs, tools, or people.
- summary: <= 200 characters, one sentence, plain text.
- slug: derived from the title, lowercase-hyphenated, letters/numbers/dashes only.
- roles, tools: short arrays (usually 1–6 items each).
- overview / challenge / goals / constraints / process / solution / results / learnings: plain markdown paragraphs. Keep each section focused; use short paragraphs and bullet lists where the notes are list-like. Do not repeat the same sentence across sections.
- metrics: only when the notes contain concrete numbers or outcomes. { value: e.g. "2K", "35%", "$1.2K"; label: short (e.g. "Users reached"); note: optional context (or "") }.
- additional_links: extra links found in the notes that aren't the live URL or case-study URL. Each { label, url }.
- seo_title: <= 60 chars. seo_description: <= 160 chars.
- Do NOT change or overwrite fields the caller already filled unless the notes clearly contradict them; when unsure, return null for that field.
- Return valid JSON matching the schema exactly.`;

function pickModelId() {
  return "openai/gpt-5.4-mini";
}

export const generateProjectFields = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => InputSchema.parse(input))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) {
      throw new Error("AI is not configured. Missing LOVABLE_API_KEY.");
    }

    const { createLovableAiGatewayProvider } = await import("@/lib/ai-gateway.server");
    const gateway = createLovableAiGatewayProvider(key, { structuredOutputs: true });
    const model = gateway(pickModelId());

    const existing = data.existing ?? {};
    const overwrite = data.overwrite ?? false;

    const userPrompt = [
      overwrite
        ? "The caller wants you to OVERWRITE existing values when your extraction is confident."
        : "The caller wants to PRESERVE existing values — return null for fields already filled unless the notes clearly contradict them.",
      "",
      "Existing field values (may be empty):",
      "```json",
      JSON.stringify(existing, null, 2),
      "```",
      "",
      "Notes / brain dump from the user:",
      "```",
      data.brainDump,
      "```",
      "",
      "Extract fields now.",
    ].join("\n");

    try {
      const { output } = await generateText({
        model,
        system: SYSTEM_PROMPT,
        prompt: userPrompt,
        output: Output.object({ schema: FieldsSchema }),
      });
      return { fields: output as AiAssistFields };
    } catch (error) {
      if (NoObjectGeneratedError.isInstance(error) && error.text) {
        try {
          const parsed = JSON.parse(error.text);
          const safe = FieldsSchema.partial().parse(parsed);
          return { fields: safe as AiAssistFields };
        } catch {
          // fall through
        }
      }
      const msg = error instanceof Error ? error.message : "AI request failed";
      if (/429|rate/i.test(msg)) throw new Error("Rate limited. Try again in a moment.");
      if (/402|credit/i.test(msg)) throw new Error("AI credits exhausted for this workspace.");
      throw new Error(msg);
    }
  });