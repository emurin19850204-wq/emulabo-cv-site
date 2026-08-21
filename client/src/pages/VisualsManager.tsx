import { ArrowDown, ArrowUp, Eye, Loader2, Plus, Save, ShieldCheck, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { ImageAssetField } from "@/components/ImageAssetField";
import { LivePreviewPanel } from "@/components/LivePreviewPanel";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { CmsContent, CmsVisual, CmsVisualKind, DEFAULT_SITE_CONTENT } from "@shared/cms";

const kindLabels: Record<CmsVisualKind, string> = { diagram: "図解・フロー", chart: "グラフ", comparison: "比較表", infographic: "インフォグラフィック", other: "その他" };

function Field({ label, value, onChange, multiline = false, hint }: { label: string; value: string; onChange: (value: string) => void; multiline?: boolean; hint?: string }) {
  const className = "mt-2 w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100";
  return <label className="block"><span className="text-sm font-semibold text-slate-800">{label}</span>{hint && <span className="ml-2 text-xs text-slate-500">{hint}</span>}{multiline ? <textarea value={value} onChange={event => onChange(event.target.value)} rows={3} className={className} /> : <input value={value} onChange={event => onChange(event.target.value)} className={className} />}</label>;
}

export default function VisualsManager() {
  const { user, loading } = useAuth();
  const isAdmin = user?.role === "admin";
  const { data, isLoading } = trpc.siteContent.adminGet.useQuery(undefined, { enabled: isAdmin });
  const { data: pages = [] } = trpc.sitePages.adminList.useQuery(undefined, { enabled: isAdmin });
  const save = trpc.siteContent.adminSave.useMutation();
  const [content, setContent] = useState<CmsContent>(DEFAULT_SITE_CONTENT);
  const [message, setMessage] = useState("");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewRevision, setPreviewRevision] = useState(0);

  useEffect(() => { if (data?.content) setContent(data.content); }, [data]);
  const placements = useMemo(() => [{ value: "/", label: "トップページ" }, ...pages.map(page => ({ value: `/${page.slug}`, label: page.title || `/${page.slug}` }))], [pages]);
  const orderedVisuals = useMemo(() => [...content.visuals].sort((a, b) => a.sortOrder - b.sortOrder), [content.visuals]);
  const patchVisual = (id: string, patch: Partial<CmsVisual>) => setContent(current => ({ ...current, visuals: current.visuals.map(visual => visual.id === id ? { ...visual, ...patch } : visual) }));
  const addVisual = () => setContent(current => ({ ...current, visuals: [...current.visuals, { id: `visual-${Date.now()}`, title: "", description: "", imageUrl: "", imageAlt: "", kind: "diagram", placement: "/", isPublished: false, sortOrder: Math.max(0, ...current.visuals.map(visual => visual.sortOrder)) + 10 }] }));
  const removeVisual = (id: string) => setContent(current => ({ ...current, visuals: current.visuals.filter(visual => visual.id !== id) }));
  const moveVisual = (id: string, direction: -1 | 1) => setContent(current => {
    const ordered = [...current.visuals].sort((a, b) => a.sortOrder - b.sortOrder);
    const index = ordered.findIndex(visual => visual.id === id);
    const nextIndex = index + direction;
    if (index < 0 || nextIndex < 0 || nextIndex >= ordered.length) return current;
    const currentItem = ordered[index]; const nextItem = ordered[nextIndex];
    ordered[index] = { ...nextItem, sortOrder: currentItem.sortOrder };
    ordered[nextIndex] = { ...currentItem, sortOrder: nextItem.sortOrder };
    return { ...current, visuals: ordered };
  });
  const saveVisuals = () => save.mutate({ contentJson: JSON.stringify(content) }, { onSuccess: () => { setMessage("保存しました。公開中の図表は指定したページに反映されています。プレビューを更新して確認してください。"); setPreviewRevision(value => value + 1); }, onError: error => setMessage(error.message) });
  const previewSource = orderedVisuals.find(visual => visual.isPublished)?.placement || "/";

  if (loading) return <DashboardLayout><div className="p-8"><Loader2 className="animate-spin" /></div></DashboardLayout>;
  if (!isAdmin) return <DashboardLayout><div className="mx-auto max-w-xl py-20 text-center"><ShieldCheck className="mx-auto h-10 w-10 text-slate-400" /><h1 className="mt-5 text-2xl font-bold">管理者権限が必要です</h1><p className="mt-3 text-sm leading-6 text-slate-600">図表の管理はEMULABOサイトの管理者だけが利用できます。</p></div></DashboardLayout>;

  return <DashboardLayout><div className={`mx-auto pb-24 ${isPreviewOpen ? "max-w-[1720px] xl:grid xl:grid-cols-[minmax(0,1fr)_minmax(360px,470px)] xl:gap-6" : "max-w-5xl"}`}><main>
    <header className="mb-8 border-b border-slate-200 pb-6"><p className="font-mono text-xs tracking-widest text-sky-700">EMULABO CMS / VISUALS</p><div className="mt-3 flex flex-wrap items-end justify-between gap-4"><div><h1 className="text-3xl font-bold tracking-tight text-slate-950">図表・インフォグラフィックを管理</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">図解、グラフ、比較表を写真のように差し替えられます。実データや権利を確認した図表だけを公開してください。</p></div><button type="button" onClick={() => setIsPreviewOpen(true)} className="inline-flex items-center gap-2 rounded-md bg-[#102845] px-3.5 py-2 text-sm font-bold text-white"><Eye size={16} />公開ページを確認</button></div></header>
    <div className="mb-5 rounded-xl border border-sky-100 bg-sky-50 p-4 text-sm leading-6 text-slate-700"><strong className="text-slate-900">かんたん5操作：</strong> 「図表を追加」→「図表画像を選ぶ」→「見出し・場所を入力」→「公開する」→ 下部の「変更を保存」です。</div>
    {isLoading ? <div className="flex min-h-64 items-center justify-center"><Loader2 className="animate-spin text-sky-700" /></div> : <div className="space-y-5">{orderedVisuals.length === 0 ? <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center"><p className="font-bold text-slate-900">図表はまだありません。</p><p className="mt-2 text-sm leading-6 text-slate-600">研修の流れ、支援内容の比較、実績グラフなどを追加できます。</p></div> : orderedVisuals.map((visual, index) => <article key={visual.id} className="rounded-xl border border-slate-200 bg-slate-50/70 p-5 shadow-sm"><div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-200 pb-4"><div><p className="font-mono text-xs tracking-widest text-sky-700">VISUAL {String(index + 1).padStart(2, "0")}</p><p className="mt-1 text-sm text-slate-600">{kindLabels[visual.kind]} / {placements.find(placement => placement.value === visual.placement)?.label ?? visual.placement}</p></div><div className="flex flex-wrap gap-2"><button type="button" onClick={() => moveVisual(visual.id, -1)} disabled={index === 0} className="rounded-md border border-slate-200 bg-white p-2 text-slate-700 disabled:opacity-40" aria-label="上へ移動"><ArrowUp size={16} /></button><button type="button" onClick={() => moveVisual(visual.id, 1)} disabled={index === orderedVisuals.length - 1} className="rounded-md border border-slate-200 bg-white p-2 text-slate-700 disabled:opacity-40" aria-label="下へ移動"><ArrowDown size={16} /></button><button type="button" onClick={() => removeVisual(visual.id)} className="inline-flex items-center gap-1 rounded-md border border-rose-200 bg-white px-3 py-2 text-sm font-bold text-rose-700"><Trash2 size={15} />削除</button></div></div><div className="mt-5 grid gap-4 md:grid-cols-2"><Field label="図表の見出し" value={visual.title} onChange={value => patchVisual(visual.id, { title: value })} /><label className="block"><span className="text-sm font-semibold text-slate-800">図表の種類</span><select value={visual.kind} onChange={event => patchVisual(visual.id, { kind: event.target.value as CmsVisualKind })} className="mt-2 w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900"><option value="diagram">図解・フロー</option><option value="chart">グラフ</option><option value="comparison">比較表</option><option value="infographic">インフォグラフィック</option><option value="other">その他</option></select></label><Field label="説明（任意）" value={visual.description} multiline onChange={value => patchVisual(visual.id, { description: value })} /><label className="block"><span className="text-sm font-semibold text-slate-800">表示する場所</span><select value={visual.placement} onChange={event => patchVisual(visual.id, { placement: event.target.value })} className="mt-2 w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900">{placements.map(placement => <option value={placement.value} key={placement.value}>{placement.label}</option>)}</select></label></div><div className="mt-5"><ImageAssetField label="図表画像" value={visual.imageUrl} onChange={value => patchVisual(visual.id, { imageUrl: value })} alt={visual.imageAlt} onAltChange={value => patchVisual(visual.id, { imageAlt: value })} recommendedAlt={visual.title || "図表の内容を簡潔に説明する文章"} /></div><label className="mt-5 flex cursor-pointer items-start gap-3 rounded-lg border border-slate-200 bg-white p-3"><input type="checkbox" checked={visual.isPublished} onChange={event => patchVisual(visual.id, { isPublished: event.target.checked })} className="mt-1 h-4 w-4 accent-sky-600" /><span><strong className="text-sm text-slate-900">公開する</strong><span className="mt-1 block text-xs leading-5 text-slate-600">オンにしてページを保存すると、選んだ場所へ表示されます。</span></span></label></article>)}<button type="button" onClick={addVisual} className="inline-flex items-center gap-2 rounded-md bg-[#102845] px-4 py-2.5 text-sm font-bold text-white"><Plus size={16} />図表を追加</button></div>}
    <div className="fixed inset-x-0 bottom-0 z-20 border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur"><div className="mx-auto flex max-w-5xl items-center justify-between gap-4"><p className="text-xs text-slate-600">{message || "変更内容は保存するまで公開サイトに反映されません。"}</p><button type="button" onClick={saveVisuals} disabled={save.isPending} className="inline-flex shrink-0 items-center gap-2 rounded-md bg-sky-600 px-4 py-2.5 text-sm font-bold text-white disabled:opacity-60"><Save size={16} />{save.isPending ? "保存中…" : "変更を保存"}</button></div></div>
  </main>{isPreviewOpen && <LivePreviewPanel title="図表の公開ページ" source={previewSource} revision={previewRevision} onClose={() => setIsPreviewOpen(false)} onRefresh={() => setPreviewRevision(value => value + 1)} />}</div></DashboardLayout>;
}
