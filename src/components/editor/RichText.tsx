import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { useEffect } from "react";
import { Bold, Italic, List, ListOrdered, Quote, Heading2, Link as LinkIcon, Image as ImageIcon } from "lucide-react";

type Props = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  onUploadImage?: (file: File) => Promise<string>;
};

export function RichText({ value, onChange, onUploadImage }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false, autolink: true }),
      Image,
    ],
    content: value || "",
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none min-h-[140px] rounded-b-md border border-t-0 border-line bg-cloud px-3 py-3 focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if ((value || "") !== current) editor.commands.setContent(value || "", { emitUpdate: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, editor]);

  if (!editor) return null;

  const Btn = ({ active, onClick, children, label }: { active?: boolean; onClick: () => void; children: React.ReactNode; label: string }) => (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={`rounded px-2 py-1 text-xs ${active ? "bg-ink text-cloud" : "text-ink-soft hover:bg-surface"}`}
    >
      {children}
    </button>
  );

  return (
    <div>
      <div className="flex flex-wrap items-center gap-1 rounded-t-md border border-line bg-surface/50 px-2 py-1.5">
        <Btn label="Heading" active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}><Heading2 size={14} /></Btn>
        <Btn label="Bold" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}><Bold size={14} /></Btn>
        <Btn label="Italic" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}><Italic size={14} /></Btn>
        <Btn label="Bullet list" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}><List size={14} /></Btn>
        <Btn label="Ordered list" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}><ListOrdered size={14} /></Btn>
        <Btn label="Quote" active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}><Quote size={14} /></Btn>
        <Btn label="Link" active={editor.isActive("link")} onClick={() => {
          const prev = editor.getAttributes("link").href as string | undefined;
          const url = window.prompt("URL", prev || "https://");
          if (url === null) return;
          if (url === "") { editor.chain().focus().extendMarkRange("link").unsetLink().run(); return; }
          const withProto = /^https?:\/\//.test(url) ? url : `https://${url}`;
          editor.chain().focus().extendMarkRange("link").setLink({ href: withProto }).run();
        }}><LinkIcon size={14} /></Btn>
        {onUploadImage && (
          <label className="cursor-pointer rounded px-2 py-1 text-xs text-ink-soft hover:bg-surface">
            <ImageIcon size={14} />
            <input type="file" accept="image/*" hidden onChange={async (e) => {
              const f = e.target.files?.[0];
              if (!f) return;
              try {
                const url = await onUploadImage(f);
                editor.chain().focus().setImage({ src: url }).run();
              } catch { /* toast handled upstream */ }
              e.currentTarget.value = "";
            }} />
          </label>
        )}
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}