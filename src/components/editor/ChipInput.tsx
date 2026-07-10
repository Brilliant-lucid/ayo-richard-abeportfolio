import { useState, KeyboardEvent } from "react";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, arrayMove, horizontalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { X, GripHorizontal } from "lucide-react";

type Props = {
  values: string[];
  onChange: (next: string[]) => void;
  suggestions?: string[];
  placeholder?: string;
  sortable?: boolean;
};

function Chip({ id, label, onRemove, sortable }: { id: string; label: string; onRemove: () => void; sortable?: boolean }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = sortable ? { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 } : undefined;
  return (
    <span ref={setNodeRef} style={style} className="inline-flex items-center gap-1 rounded-full border border-line bg-surface/60 px-2.5 py-1 text-xs">
      {sortable && <span {...attributes} {...listeners} className="cursor-grab text-muted-ink"><GripHorizontal size={10} /></span>}
      {label}
      <button type="button" aria-label={`Remove ${label}`} onClick={onRemove} className="text-muted-ink hover:text-destructive">
        <X size={12} />
      </button>
    </span>
  );
}

export function ChipInput({ values, onChange, suggestions = [], placeholder, sortable }: Props) {
  const [draft, setDraft] = useState("");
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));

  function add(raw: string) {
    const v = raw.trim().replace(/,+$/, "");
    if (!v) return;
    if (values.map((x) => x.toLowerCase()).includes(v.toLowerCase())) { setDraft(""); return; }
    onChange([...values, v]);
    setDraft("");
  }

  function onKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") { e.preventDefault(); add(draft); }
    else if (e.key === "Backspace" && !draft && values.length) { onChange(values.slice(0, -1)); }
  }

  const filteredSuggestions = suggestions.filter(
    (s) => !values.map((v) => v.toLowerCase()).includes(s.toLowerCase()) && s.toLowerCase().includes(draft.toLowerCase()),
  );

  const chips = (
    <>
      {values.map((v, i) => (
        <Chip key={v + i} id={v + "-" + i} label={v} sortable={sortable} onRemove={() => onChange(values.filter((_, idx) => idx !== i))} />
      ))}
    </>
  );

  return (
    <div>
      <div className="flex flex-wrap items-center gap-1.5 rounded-md border border-line bg-cloud px-2 py-1.5 focus-within:border-electric">
        {sortable ? (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => {
            const { active, over } = e;
            if (!over || active.id === over.id) return;
            const ids = values.map((v, i) => v + "-" + i);
            const oldIndex = ids.indexOf(active.id as string);
            const newIndex = ids.indexOf(over.id as string);
            if (oldIndex >= 0 && newIndex >= 0) onChange(arrayMove(values, oldIndex, newIndex));
          }}>
            <SortableContext items={values.map((v, i) => v + "-" + i)} strategy={horizontalListSortingStrategy}>
              {chips}
            </SortableContext>
          </DndContext>
        ) : chips}
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKey}
          onBlur={() => draft && add(draft)}
          placeholder={values.length ? "" : placeholder || "Type and press Enter"}
          className="min-w-[8ch] flex-1 bg-transparent px-1 py-1 text-sm focus:outline-none"
        />
      </div>
      {draft && filteredSuggestions.length > 0 && (
        <div className="mt-1 flex flex-wrap gap-1">
          {filteredSuggestions.slice(0, 6).map((s) => (
            <button key={s} type="button" onClick={() => add(s)} className="rounded-full border border-line px-2 py-0.5 text-xs text-muted-ink hover:bg-surface">
              + {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}