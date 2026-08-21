import { ExternalLink, Monitor, RefreshCw, X } from "lucide-react";

type LivePreviewPanelProps = {
  title: string;
  source: string;
  revision: number;
  onClose: () => void;
  onRefresh: () => void;
};

export function LivePreviewPanel({ title, source, revision, onClose, onRefresh }: LivePreviewPanelProps) {
  const separator = source.includes("?") ? "&" : "?";
  const previewSource = `${source}${separator}cms_preview=${revision}`;

  return <div className="fixed inset-0 z-50 bg-slate-950/40 p-3 xl:static xl:z-auto xl:bg-transparent xl:p-0">
    <section className="flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl xl:sticky xl:top-6 xl:h-[calc(100vh-3rem)] xl:shadow-sm" aria-label={`${title}のライブプレビュー`}>
      <header className="flex items-start justify-between gap-3 border-b border-slate-200 px-4 py-3">
        <div className="min-w-0"><p className="inline-flex items-center gap-1 text-xs font-bold tracking-wide text-sky-800"><Monitor size={14} />公開中の見え方</p><h2 className="mt-1 truncate text-sm font-bold text-slate-900">{title}</h2><p className="mt-1 text-xs leading-5 text-slate-600">未保存の変更は反映されません。保存後に更新してください。</p></div>
        <div className="flex shrink-0 items-center gap-1"><button type="button" onClick={onClose} className="mr-1 rounded-md border border-slate-300 px-2.5 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-100 xl:hidden">編集に戻る</button><button type="button" onClick={onRefresh} className="rounded-md p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900" aria-label="プレビューを更新"><RefreshCw size={17} /></button><a href={source} target="_blank" rel="noreferrer" className="rounded-md p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900" aria-label="公開ページを別タブで開く"><ExternalLink size={17} /></a><button type="button" onClick={onClose} className="hidden rounded-md p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 xl:inline-flex" aria-label="プレビューを閉じる"><X size={18} /></button></div>
      </header>
      <iframe key={previewSource} src={previewSource} title={`${title}の公開プレビュー`} className="min-h-0 w-full flex-1 bg-white" />
    </section>
  </div>;
}
