/**
 * Design reminder — CMS page manager:
 * A plain, highly legible editorial control surface for publishing pages and links.
 * Editing controls are grouped by publishing decision rather than technical data fields.
 */
import { useEffect, useMemo, useState } from "react";
import { Check, ChevronLeft, Eye, FilePlus2, Link2, Loader2, Plus, Save, Trash2 } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { ImageAssetField } from "@/components/ImageAssetField";
import { LivePreviewPanel } from "@/components/LivePreviewPanel";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import type { TextAlign } from "@shared/cms";
import { EMPTY_LINK, EMPTY_PAGE, type SiteLinkPayload, type SitePagePayload } from "@shared/sitePages";

type ManagedPage = SitePagePayload & { id?: number };
type ManagedLink = SiteLinkPayload & { id?: number };
const copy = <T,>(value: T) => JSON.parse(JSON.stringify(value)) as T;
const EMPTY_PAGE_LIST: ManagedPage[] = [];
const EMPTY_LINK_LIST: ManagedLink[] = [];

function Input({ label, value, onChange, textarea = false, hint }: { label: string; value: string; onChange: (value: string) => void; textarea?: boolean; hint?: string }) {
  const props = { value, onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange(event.target.value), className: "mt-2 w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100" };
  return <label className="block"><span className="text-sm font-semibold text-slate-800">{label}</span>{hint && <span className="ml-2 text-xs text-slate-500">{hint}</span>}{textarea ? <textarea {...props} rows={6} /> : <input {...props} />}</label>;
}

function Toggle({ label, checked, onChange, note }: { label: string; checked: boolean; onChange: (value: boolean) => void; note?: string }) {
  return <label className="flex cursor-pointer items-start gap-3 rounded-md border border-slate-200 bg-white p-3"><input type="checkbox" checked={checked} onChange={event => onChange(event.target.checked)} className="mt-1 h-4 w-4 accent-sky-600" /><span><b className="text-sm text-slate-800">{label}</b>{note && <span className="mt-1 block text-xs leading-5 text-slate-500">{note}</span>}</span></label>;
}

function AlignmentSelect({ label, value, onChange }: { label: string; value: TextAlign; onChange: (value: TextAlign) => void }) {
  return <label className="block text-sm font-semibold text-slate-800">{label}<select value={value} onChange={event => onChange(event.target.value as TextAlign)} className="mt-2 w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"><option value="left">左寄せ</option><option value="center">中央寄せ</option><option value="right">右寄せ</option></select></label>;
}

export default function SitePagesManager() {
  const { user, loading } = useAuth();
  const isAdmin = user?.role === "admin";
  const utils = trpc.useUtils();
  const { data: savedPages, isLoading: pagesLoading } = trpc.sitePages.adminList.useQuery(undefined, { enabled: isAdmin });
  const { data: savedLinks } = trpc.sitePages.adminLinks.useQuery(undefined, { enabled: isAdmin });
  const createPage = trpc.sitePages.adminCreate.useMutation();
  const updatePage = trpc.sitePages.adminUpdate.useMutation();
  const deletePage = trpc.sitePages.adminDelete.useMutation();
  const createLink = trpc.sitePages.adminCreateLink.useMutation();
  const updateLink = trpc.sitePages.adminUpdateLink.useMutation();
  const deleteLink = trpc.sitePages.adminDeleteLink.useMutation();
  const [page, setPage] = useState<ManagedPage | null>(null);
  const [links, setLinks] = useState<ManagedLink[]>([]);
  const [notice, setNotice] = useState("");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewRevision, setPreviewRevision] = useState(0);
  const pageRecords = savedPages ?? EMPTY_PAGE_LIST;
  const linkRecords = savedLinks ?? EMPTY_LINK_LIST;

  useEffect(() => setLinks(linkRecords.map(link => ({ ...link }))), [linkRecords]);
  const isSaving = createPage.isPending || updatePage.isPending || createLink.isPending || updateLink.isPending;
  const refresh = async () => { await Promise.all([utils.sitePages.adminList.invalidate(), utils.sitePages.adminLinks.invalidate(), utils.sitePages.publicNavigation.invalidate(), utils.sitePages.publicLinks.invalidate()]); };
  const pageList = useMemo(() => pageRecords.map(item => ({ ...item })), [pageRecords]);

  const savePage = () => {
    if (!page) return;
    const payload: SitePagePayload = {
      slug: page.slug, title: page.title, eyebrow: page.eyebrow, summary: page.summary, body: page.body,
      imageUrl: page.imageUrl, imageAlt: page.imageAlt, ctaLabel: page.ctaLabel, ctaUrl: page.ctaUrl,
      navLabel: page.navLabel, headerAlign: page.headerAlign, bodyAlign: page.bodyAlign, ctaAlign: page.ctaAlign,
      showInNav: page.showInNav, isPublished: page.isPublished, sortOrder: Number(page.sortOrder) || 100,
    };
    const onSuccess = async () => { await refresh(); setNotice(`「${payload.title}」を保存しました。プレビューを更新して確認してください。`); setPreviewRevision(current => current + 1); };
    if (page.id) updatePage.mutate({ id: page.id, page: payload }, { onSuccess, onError: error => setNotice(error.message) });
    else createPage.mutate(payload, { onSuccess, onError: error => setNotice(error.message) });
  };

  const saveLinks = async () => {
    for (const link of links) {
      const payload: SiteLinkPayload = { label: link.label, url: link.url, location: link.location, isExternal: link.isExternal, isVisible: link.isVisible, sortOrder: Number(link.sortOrder) || 100 };
      if (link.id) await updateLink.mutateAsync({ id: link.id, link: payload });
      else { const created = await createLink.mutateAsync(payload); setLinks(current => current.map(item => item === link ? { ...created } : item)); }
    }
    await refresh(); setNotice("リンク設定を保存しました。");
  };

  const removeLink = async (link: ManagedLink) => {
    if (!window.confirm(`「${link.label}」を削除しますか？`)) return;
    if (link.id) await deleteLink.mutateAsync({ id: link.id }); else setLinks(current => current.filter(item => item !== link));
    await refresh(); setNotice("リンクを削除しました。");
  };

  if (loading) return <DashboardLayout><div className="p-8"><Loader2 className="animate-spin" /></div></DashboardLayout>;
  if (!isAdmin) return <DashboardLayout><div className="mx-auto max-w-xl py-20 text-center"><h1 className="text-2xl font-bold">管理者権限が必要です</h1><p className="mt-3 text-sm text-slate-600">ページ・リンクの編集はEMULABO管理者のみが実行できます。</p></div></DashboardLayout>;

  return <DashboardLayout><div className={`mx-auto pb-20 ${isPreviewOpen && page?.id ? "max-w-[1720px] xl:grid xl:grid-cols-[minmax(0,1fr)_minmax(360px,470px)] xl:gap-6" : "max-w-6xl"}`}><main>
    <header className="mb-8 border-b border-slate-200 pb-6"><a href="/admin" className="inline-flex items-center gap-1 text-sm font-bold text-sky-700"><ChevronLeft size={16} /> コンテンツ編集へ戻る</a><p className="mt-6 font-mono text-xs tracking-widest text-sky-700">EMULABO CMS / PAGES & LINKS</p><h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">追加ページとリンクを管理</h1><p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">ページを作成して公開し、ヘッダーまたはフッターに内部・外部リンクを掲載できます。公開をオフにしたページは外部から閲覧できません。</p></header>
    {notice && <div className="mb-6 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"><Check size={16} />{notice}</div>}
    <div className="grid gap-7 lg:grid-cols-[.75fr_1.25fr]">
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between"><div><h2 className="text-base font-bold">ページ一覧</h2><p className="mt-1 text-xs text-slate-500">ページを選択して編集できます。</p></div><button type="button" onClick={() => setPage(copy(EMPTY_PAGE))} className="inline-flex items-center gap-2 rounded-md bg-[#102845] px-3 py-2 text-xs font-bold text-white"><FilePlus2 size={15} />新規ページ</button></div>
        <div className="mt-5 space-y-2">{pagesLoading ? <Loader2 className="animate-spin text-sky-700" /> : pageList.length === 0 ? <p className="rounded-lg bg-slate-50 p-4 text-sm text-slate-500">まだ追加ページはありません。</p> : pageList.map(item => <button type="button" key={item.id} onClick={() => setPage(copy(item))} className="w-full rounded-lg border border-slate-200 p-3 text-left transition hover:border-sky-400 hover:bg-sky-50"><span className="block text-sm font-bold text-slate-900">{item.title}</span><span className="mt-1 flex items-center justify-between text-xs text-slate-500"><span>/{item.slug}</span><span>{item.isPublished ? "公開中" : "下書き"}</span></span></button>)}</div>
        <div className="mt-8 border-t border-slate-200 pt-6"><div className="flex items-center gap-2"><Link2 size={16} className="text-sky-700" /><h2 className="text-base font-bold">リンク設定</h2></div><p className="mt-1 text-xs leading-5 text-slate-500">ヘッダーまたはフッターに表示するリンクを管理します。</p><div className="mt-4 space-y-4">{links.map((link, index) => <div key={`${link.id ?? "new"}-${index}`} className="rounded-lg border border-slate-200 bg-slate-50 p-3"><div className="grid gap-3 sm:grid-cols-2"><Input label="表示名" value={link.label} onChange={value => setLinks(current => current.map((item, itemIndex) => itemIndex === index ? { ...item, label: value } : item))} /><Input label="URL" value={link.url} onChange={value => setLinks(current => current.map((item, itemIndex) => itemIndex === index ? { ...item, url: value } : item))} /></div><div className="mt-3 grid gap-3 sm:grid-cols-2"><label className="text-xs font-semibold text-slate-700">表示場所<select value={link.location} onChange={event => setLinks(current => current.map((item, itemIndex) => itemIndex === index ? { ...item, location: event.target.value as SiteLinkPayload["location"] } : item))} className="mt-1 w-full rounded border border-slate-200 bg-white p-2 text-sm"><option value="header">ヘッダー</option><option value="footer">フッター</option></select></label><Input label="並び順" value={String(link.sortOrder)} onChange={value => setLinks(current => current.map((item, itemIndex) => itemIndex === index ? { ...item, sortOrder: Number(value) || 0 } : item))} /></div><div className="mt-3 grid gap-2 sm:grid-cols-2"><Toggle label="外部リンク" checked={link.isExternal} onChange={value => setLinks(current => current.map((item, itemIndex) => itemIndex === index ? { ...item, isExternal: value } : item))} /><Toggle label="表示する" checked={link.isVisible} onChange={value => setLinks(current => current.map((item, itemIndex) => itemIndex === index ? { ...item, isVisible: value } : item))} /></div><button type="button" onClick={() => removeLink(link)} className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-rose-700"><Trash2 size={13} />削除</button></div>)}</div><div className="mt-4 flex gap-3"><button type="button" onClick={() => setLinks(current => [...current, copy(EMPTY_LINK)])} className="inline-flex items-center gap-1 text-xs font-bold text-sky-700"><Plus size={14} />リンクを追加</button>{links.length > 0 && <button type="button" onClick={saveLinks} disabled={isSaving} className="ml-auto inline-flex items-center gap-2 rounded-md bg-sky-600 px-3 py-2 text-xs font-bold text-white disabled:opacity-60"><Save size={14} />リンクを保存</button>}</div></div>
      </section>
      <section className="min-h-[520px] rounded-xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
        {page ? <div><div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-5"><div><p className="font-mono text-xs tracking-widest text-sky-700">{page.id ? "EDIT PAGE" : "NEW PAGE"}</p><h2 className="mt-2 text-xl font-bold">{page.id ? "ページを編集" : "新しいページを作成"}</h2></div><div className="flex shrink-0 items-center gap-3">{page.id && page.isPublished && <button type="button" onClick={() => setIsPreviewOpen(true)} className="inline-flex items-center gap-1.5 rounded-md bg-[#102845] px-3 py-2 text-xs font-bold text-white"><Eye size={14} />画面を見ながら編集</button>}<button type="button" onClick={() => setPage(null)} className="text-xs font-bold text-slate-500">閉じる</button></div></div>{page.id && !page.isPublished && <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs leading-5 text-amber-900">このページは下書きです。公開するをオンにして保存すると、公開ページを見ながら編集できます。</p>}
          <div className="mt-5 space-y-5"><div className="grid gap-4 md:grid-cols-2"><Input label="ページタイトル" value={page.title} onChange={value => setPage(current => current ? { ...current, title: value } : current)} /><Input label="URLスラッグ" value={page.slug} hint="半角英数とハイフンのみ" onChange={value => setPage(current => current ? { ...current, slug: value.toLowerCase().replace(/[^a-z0-9-]/g, "") } : current)} /><Input label="アイブロウ" value={page.eyebrow} onChange={value => setPage(current => current ? { ...current, eyebrow: value } : current)} /><Input label="メニュー表示名" value={page.navLabel} onChange={value => setPage(current => current ? { ...current, navLabel: value } : current)} /><Input label="概要" value={page.summary} textarea hint="Enterで改行できます" onChange={value => setPage(current => current ? { ...current, summary: value } : current)} /><Input label="本文" value={page.body} textarea hint="Enterで改行、空行で段落を分けます" onChange={value => setPage(current => current ? { ...current, body: value } : current)} /></div>
            <div className="grid gap-4 rounded-lg border border-sky-100 bg-sky-50/50 p-4 md:grid-cols-3"><AlignmentSelect label="見出し・概要の配置" value={page.headerAlign} onChange={value => setPage(current => current ? { ...current, headerAlign: value } : current)} /><AlignmentSelect label="本文の配置" value={page.bodyAlign} onChange={value => setPage(current => current ? { ...current, bodyAlign: value } : current)} /><AlignmentSelect label="CTAの配置" value={page.ctaAlign} onChange={value => setPage(current => current ? { ...current, ctaAlign: value } : current)} /></div>
            <ImageAssetField label="アイキャッチ画像" value={page.imageUrl} onChange={value => setPage(current => current ? { ...current, imageUrl: value } : current)} alt={page.imageAlt} onAltChange={value => setPage(current => current ? { ...current, imageAlt: value } : current)} recommendedAlt={page.title ? `${page.title}を表す画像` : "ページ内容を表す画像"} /><div className="grid gap-4 md:grid-cols-2"><Input label="並び順" value={String(page.sortOrder)} onChange={value => setPage(current => current ? { ...current, sortOrder: Number(value) || 0 } : current)} /><Input label="CTAボタンの表示名" value={page.ctaLabel} onChange={value => setPage(current => current ? { ...current, ctaLabel: value } : current)} /><Input label="CTAリンク先" value={page.ctaUrl} onChange={value => setPage(current => current ? { ...current, ctaUrl: value } : current)} /></div>
            <div className="grid gap-3 md:grid-cols-2"><Toggle label="公開する" checked={page.isPublished} note="オフの場合、URLを知っていても外部から表示されません。" onChange={value => setPage(current => current ? { ...current, isPublished: value } : current)} /><Toggle label="ヘッダーに掲載する" checked={page.showInNav} note="公開中のときだけヘッダーメニューに表示されます。" onChange={value => setPage(current => current ? { ...current, showInNav: value } : current)} /></div>
            <div className="flex flex-wrap items-center gap-3 border-t border-slate-200 pt-5"><button type="button" onClick={savePage} disabled={isSaving} className="inline-flex items-center gap-2 rounded-md bg-sky-600 px-4 py-2.5 text-sm font-bold text-white disabled:opacity-60"><Save size={16} />{isSaving ? "保存中…" : "ページを保存"}</button>{page.id && <button type="button" onClick={async () => { if (!window.confirm(`「${page.title}」を削除しますか？`)) return; await deletePage.mutateAsync({ id: page.id ?? 0 }); await refresh(); setPage(null); setNotice("ページを削除しました。"); }} className="inline-flex items-center gap-2 px-3 py-2 text-sm font-bold text-rose-700"><Trash2 size={15} />削除</button>}</div>
          </div></div> : <div className="flex h-full min-h-[480px] flex-col items-center justify-center text-center"><FilePlus2 className="h-10 w-10 text-slate-300" /><h2 className="mt-5 text-xl font-bold">ページを選択してください</h2><p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">左の一覧から既存ページを選ぶか、新規ページを作成すると、本文・画像・CTA・公開状態を編集できます。</p></div>}
      </section>
    </div>
  </main>{isPreviewOpen && page?.id && <LivePreviewPanel title={page.title || "追加ページ"} source={`/${page.slug}`} revision={previewRevision} onClose={() => setIsPreviewOpen(false)} onRefresh={() => setPreviewRevision(current => current + 1)} />}</div></DashboardLayout>;
}
