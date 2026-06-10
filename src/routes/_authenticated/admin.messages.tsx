import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { listMessages, markMessageRead } from "@/lib/cms/admin.functions";

const qo = queryOptions({ queryKey: ["admin", "messages"], queryFn: () => listMessages() });

export const Route = createFileRoute("/_authenticated/admin/messages")({
  loader: ({ context }) => context.queryClient.ensureQueryData(qo),
  component: Page,
  errorComponent: ({ error }) => <div className="text-destructive">{error.message}</div>,
  notFoundComponent: () => <div>Not found</div>,
});

function Page() {
  const { data } = useSuspenseQuery(qo);
  const qc = useQueryClient();
  const mark = useServerFn(markMessageRead);
  const mut = useMutation({ mutationFn: mark, onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "messages"] }) });
  return (
    <div className="space-y-6">
      <h1 className="font-display text-4xl">Messages</h1>
      <div className="space-y-3">
        {data.map((m) => (
          <div key={m.id} className={`rounded-2xl border p-5 ${m.read ? "border-line bg-cloud" : "border-electric/40 bg-electric/5"}`}>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">{m.name} <span className="text-muted-ink text-sm">· {m.email}</span></div>
                {m.subject && <div className="text-sm text-ink-soft">{m.subject}</div>}
              </div>
              <div className="text-xs text-muted-ink">{new Date(m.created_at).toLocaleString()}</div>
            </div>
            <p className="mt-3 whitespace-pre-wrap text-sm">{m.message}</p>
            <div className="mt-3">
              <button onClick={() => mut.mutate({ data: { id: m.id, read: !m.read } })} className="text-xs text-electric hover:underline">
                Mark as {m.read ? "unread" : "read"}
              </button>
            </div>
          </div>
        ))}
        {data.length === 0 && <div className="p-6 text-center text-sm text-muted-ink">No messages.</div>}
      </div>
    </div>
  );
}