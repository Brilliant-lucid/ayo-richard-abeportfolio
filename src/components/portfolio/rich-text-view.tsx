export function isHtml(s: string) {
  return /^\s*<(p|h[1-6]|ul|ol|blockquote|div|figure|img|pre|table|section)\b/i.test(s);
}

export function RichOrPlain({ content }: { content: string }) {
  if (isHtml(content)) {
    return (
      <div
        className="max-w-none text-base leading-relaxed text-ink-soft [&_a]:text-electric [&_a]:underline [&_blockquote]:my-6 [&_blockquote]:border-l-2 [&_blockquote]:border-electric [&_blockquote]:pl-4 [&_blockquote]:italic [&_h2]:mt-8 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:text-ink [&_h3]:mt-6 [&_h3]:font-display [&_h3]:text-xl [&_h3]:text-ink [&_img]:my-6 [&_img]:w-full [&_img]:rounded-xl [&_img]:border [&_img]:border-line [&_li]:mb-1 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mb-4 [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }
  return <div className="whitespace-pre-wrap text-base leading-relaxed text-ink-soft">{content}</div>;
}
