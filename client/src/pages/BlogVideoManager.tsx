import { useEffect, useRef, useState } from "react";
import { Check, Eye, FilePlus2, Loader2, Save, Trash2 } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { ImageAssetField } from "@/components/ImageAssetField";
import { LivePreviewPanel } from "@/components/LivePreviewPanel";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { EMPTY_BLOG_POST, EMPTY_VIDEO, type BlogPostPayload, type VideoPayload, type VideoSourceType } from "@shared/blogVideo";

type BlogRecord = BlogPostPayload & { id?: number };
type VideoRecord = VideoPayload & { id?: number };
const clone = <T,>(value: T) => JSON.parse(JSON.stringify(value)) as T;

function Field({ label, value, onChange, textarea = false, type = "text", hint }: { label: string; value: string; onChange: (value: string) => void; textarea?: boolean; type?: string; hint?: string }) {
  const common = { value, onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange(event.target.value), className: "mt-2 w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100" };
  return <label className="block"><span className="text-sm font-semibold text-slate-800">{label}</span>{hint && <span className="ml-2 text-xs text-slate-500">{hint}</span>}{textarea ? <textarea {...common} rows={7} /> : <input {...common} type={type} />}</label>;
}

function Toggle({ label, checked, onChange, note }: { label: string; checked: boolean; onChange: (value: boolean) => void; note?: string }) {
  return <label className="flex cursor-pointer items-start gap-3 rounded-md border border-slate-200 bg-white p-3"><input type="checkbox" checked={checked} onChange={event => onChange(event.target.checked)} className="mt-1 h-4 w-4 accent-sky-600" /><span><b className="text-sm text-slate-800">{label}</b>{note && <span className="mt-1 block text-xs text-slate-500">{note}</span>}</span></label>;
}

export default function BlogVideoManager({ mode = "blog" }: { mode?: "blog" | "video" }) {
  const { user, loading } = useAuth();
  const isAdmin = user?.role === "admin";
  const utils = trpc.useUtils();
  const { data: blogData, isLoading: blogLoading } = trpc.blog.adminList.useQuery(undefined, { enabled: isAdmin && mode === "blog" });
  const { data: videoData, isLoading: videoLoading } = trpc.videos.adminList.useQuery(undefined, { enabled: isAdmin && mode === "video" });
  const createBlog = trpc.blog.adminCreate.useMutation();
  const updateBlog = trpc.blog.adminUpdate.useMutation();
  const deleteBlog = trpc.blog.adminDelete.useMutation();
  const createVideo = trpc.videos.adminCreate.useMutation();
  const updateVideo = trpc.videos.adminUpdate.useMutation();
  const deleteVideo = trpc.videos.adminDelete.useMutation();
  const [blog, setBlogState] = useState<BlogRecord | null>(null);
  const [video, setVideoState] = useState<VideoRecord | null>(null);
  const blogRef = useRef<BlogRecord | null>(null);
  const videoRef = useRef<VideoRecord | null>(null);
  const setBlog = (next: BlogRecord | null) => { blogRef.current = next; setBlogState(next); };
  const setVideo = (next: VideoRecord | null) => { videoRef.current = next; setVideoState(next); };
  const [notice, setNotice] = useState("");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewRevision, setPreviewRevision] = useState(0);
  const isBlog = mode === "blog";
  const busy = createBlog.isPending || updateBlog.isPending || deleteBlog.isPending || createVideo.isPending || updateVideo.isPending || deleteVideo.isPending;

  useEffect(() => { setBlog(null); setVideo(null); setNotice(""); }, [mode]);

  const saveBlog = () => {
    const currentBlog = blogRef.current;
    if (!currentBlog) return;
    const payload: BlogPostPayload = { ...currentBlog, sortOrder: Number(currentBlog.sortOrder) || 100 };
    const onSuccess = async () => { await utils.blog.adminList.invalidate(); setNotice(`「${payload.title}」を保存しました。プレビューを更新して確認してください。`); setPreviewRevision(current => current + 1); };
    if (currentBlog.id) updateBlog.mutate({ id: currentBlog.id, post: payload }, { onSuccess, onError: error => setNotice(error.message) });
    else createBlog.mutate(payload, { onSuccess, onError: error => setNotice(error.message) });
  };

  const saveVideo = () => {
    const currentVideo = videoRef.current;
    if (!currentVideo) return;
    const payload: VideoPayload = { ...currentVideo, sortOrder: Number(currentVideo.sortOrder) || 100 };
    const onSuccess = async () => { await utils.videos.adminList.invalidate(); setNotice(`「${payload.title}」を保存しました。プレビューを更新して確認してください。`); setPreviewRevision(current => current + 1); };
    if (currentVideo.id) updateVideo.mutate({ id: currentVideo.id, video: payload }, { onSuccess, onError: error => setNotice(error.message) });
    else createVideo.mutate(payload, { onSuccess, onError: error => setNotice(error.message) });
  };

  const removeBlog = () => { if (blog?.id && window.confirm(`「${blog.title}」を削除しますか？`)) deleteBlog.mutate({ id: blog.id }, { onSuccess: async () => { await utils.blog.adminList.invalidate(); setBlog(null); setNotice("記事を削除しました。"); } }); };
  const removeVideo = () => { if (video?.id && window.confirm(`「${video.title}」を削除しますか？`)) deleteVideo.mutate({ id: video.id }, { onSuccess: async () => { await utils.videos.adminList.invalidate(); setVideo(null); setNotice("動画を削除しました。"); } }); };

  if (loading) return <DashboardLayout><div className="p-8"><Loader2 className="animate-spin" /></div></DashboardLayout>;
  if (!isAdmin) return <DashboardLayout><div className="mx-auto max-w-xl py-20 text-center"><h1 className="text-2xl font-bold">管理者権限が必要です</h1><p className="mt-3 text-sm text-slate-600">ブログと動画の編集はEMULABO管理者のみが実行できます。</p></div></DashboardLayout>;

  const blogRecords: BlogRecord[] = (blogData ?? []).map(item => ({ ...item, publishedAt: item.publishedAt?.toISOString() ?? null }));
  const videoRecords: VideoRecord[] = (videoData ?? []).map(item => ({ ...item, publishedAt: item.publishedAt?.toISOString() ?? null }));
  const records = isBlog ? blogRecords : videoRecords;
  const selected = isBlog ? blog : video;
  const setSelected = (record: BlogRecord | VideoRecord | null) => isBlog ? setBlog(record as BlogRecord | null) : setVideo(record as VideoRecord | null);
  const previewPath = selected?.id ? `/${isBlog ? "blog" : "videos"}/${selected.slug}` : null;

  return <DashboardLayout><div className={`mx-auto pb-20 ${isPreviewOpen && previewPath ? "max-w-[1720px] xl:grid xl:grid-cols-[minmax(0,1fr)_minmax(360px,470px)] xl:gap-6" : "max-w-6xl"}`}><main>
    <header className="mb-8 border-b border-slate-200 pb-6"><a href="/admin" className="text-sm font-bold text-sky-700">← コンテンツ編集へ戻る</a><p className="mt-6 font-mono text-xs tracking-widest text-sky-700">EMULABO CMS / {isBlog ? "BLOG" : "VIDEO"}</p><h1 className="mt-3 text-3xl font-bold text-slate-950">{isBlog ? "ブログ記事を管理" : "動画を管理"}</h1><p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{isBlog ? "記事を作成して公開できます。本文は空行で段落を分け、公開をオフにすると下書きとして保存されます。" : "YouTube・Vimeo・直接動画URL・Manusストレージの動画を登録できます。"}</p><div className="mt-4 rounded-lg border border-sky-100 bg-sky-50 px-4 py-3 text-xs leading-5 text-slate-700"><b className="text-sky-900">運用手順：</b> ①新規作成 → ②公開オフで下書き保存 → ③一覧から再編集 → ④内容確認後に「公開する」をオンにして保存。画像は「画像を選択」からアップロードし、代替テキストを確認してください。</div><div className="mt-4 flex gap-2"><a href="/admin/blog" className={`rounded-md px-3 py-2 text-xs font-bold ${isBlog ? "bg-[#102845] text-white" : "bg-slate-100 text-slate-700"}`}>ブログ</a><a href="/admin/videos" className={`rounded-md px-3 py-2 text-xs font-bold ${!isBlog ? "bg-[#102845] text-white" : "bg-slate-100 text-slate-700"}`}>動画</a></div></header>
    {notice && <div className="mb-6 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"><Check size={16} />{notice}</div>}
    <div className="grid gap-7 lg:grid-cols-[.75fr_1.25fr]">
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><div><h2 className="text-base font-bold">{isBlog ? "記事一覧" : "動画一覧"}</h2><p className="mt-1 text-xs text-slate-500">選択して編集できます。</p></div><button type="button" onClick={() => setSelected(clone(isBlog ? EMPTY_BLOG_POST : EMPTY_VIDEO))} className="inline-flex items-center gap-2 rounded-md bg-[#102845] px-3 py-2 text-xs font-bold text-white"><FilePlus2 size={15} />新規作成</button></div><div className="mt-5 space-y-2">{(isBlog ? blogLoading : videoLoading) ? <Loader2 className="animate-spin text-sky-700" /> : records.length === 0 ? <p className="rounded-lg bg-slate-50 p-4 text-sm text-slate-500">まだ登録がありません。</p> : records.map(item => <button type="button" key={item.id} onClick={() => setSelected(clone(item))} className="w-full rounded-lg border border-slate-200 p-3 text-left hover:border-sky-400 hover:bg-sky-50"><span className="block text-sm font-bold text-slate-900">{item.title}</span><span className="mt-1 flex justify-between text-xs text-slate-500"><span>/{isBlog ? "blog" : "videos"}/{item.slug}</span><span>{item.isPublished ? "公開中" : "下書き"}</span></span></button>)}</div></section>
      <section className="min-h-[520px] rounded-xl border border-slate-200 bg-slate-50 p-5 shadow-sm">{selected ? <div><div className="flex items-start justify-between border-b border-slate-200 pb-5"><div><p className="font-mono text-xs tracking-widest text-sky-700">{selected.id ? "EDIT" : "NEW"}</p><h2 className="mt-2 text-xl font-bold">{selected.id ? "編集" : "新規作成"}</h2></div><div className="flex shrink-0 items-center gap-3">{selected.id && selected.isPublished && <button type="button" onClick={() => setIsPreviewOpen(true)} className="inline-flex items-center gap-1.5 rounded-md bg-[#102845] px-3 py-2 text-xs font-bold text-white"><Eye size={14} />画面を見ながら編集</button>}<button type="button" onClick={() => setSelected(null)} className="text-xs font-bold text-slate-500">閉じる</button></div></div>{selected.id && !selected.isPublished && <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs leading-5 text-amber-900">このコンテンツは下書きです。公開するをオンにして保存すると、公開ページを見ながら編集できます。</p>}{isBlog && blog ? <div className="mt-5 space-y-5"><div className="grid gap-4 md:grid-cols-2"><Field label="タイトル" value={blog.title} onChange={value => setBlog({ ...blog, title: value })} /><Field label="スラッグ" value={blog.slug} hint="半角英数とハイフン" onChange={value => setBlog({ ...blog, slug: value.toLowerCase().replace(/[^a-z0-9-]/g, "") })} /></div><Field label="概要" value={blog.excerpt} textarea onChange={value => setBlog({ ...blog, excerpt: value })} /><Field label="本文" value={blog.body} textarea hint="空行で段落分け" onChange={value => setBlog({ ...blog, body: value })} /><ImageAssetField label="アイキャッチ画像" value={blog.coverImageUrl} onChange={value => setBlog({ ...blog, coverImageUrl: value })} alt={blog.coverImageAlt} onAltChange={value => setBlog({ ...blog, coverImageAlt: value })} recommendedAlt={blog.title ? `${blog.title}のアイキャッチ画像` : "記事内容を表すアイキャッチ画像"} /><div className="grid gap-4 md:grid-cols-2"><Field label="著者" value={blog.author} onChange={value => setBlog({ ...blog, author: value })} /><Field label="公開日時" value={blog.publishedAt ?? ""} type="datetime-local" onChange={value => setBlog({ ...blog, publishedAt: value ? new Date(value).toISOString() : null })} /></div><div className="grid gap-3 md:grid-cols-2"><Toggle label="公開する" checked={blog.isPublished} note="公開後は /blog/スラッグ で閲覧できます。" onChange={value => setBlog({ ...(blogRef.current ?? blog), isPublished: value })} /><Field label="並び順" value={String(blog.sortOrder)} onChange={value => setBlog({ ...blog, sortOrder: Number(value) || 0 })} /></div><div className="flex gap-3"><button type="button" onClick={saveBlog} disabled={busy} className="inline-flex items-center gap-2 rounded-md bg-sky-600 px-4 py-2.5 text-sm font-bold text-white disabled:opacity-60"><Save size={15} />保存</button>{blog.id && <button type="button" onClick={removeBlog} disabled={busy} className="inline-flex items-center gap-2 rounded-md border border-rose-200 px-4 py-2.5 text-sm font-bold text-rose-700"><Trash2 size={15} />削除</button>}</div></div> : video ? <div className="mt-5 space-y-5"><div className="grid gap-4 md:grid-cols-2"><Field label="タイトル" value={video.title} onChange={value => setVideo({ ...video, title: value })} /><Field label="スラッグ" value={video.slug} hint="半角英数とハイフン" onChange={value => setVideo({ ...video, slug: value.toLowerCase().replace(/[^a-z0-9-]/g, "") })} /></div><Field label="説明" value={video.description} textarea onChange={value => setVideo({ ...video, description: value })} /><div className="grid gap-4 md:grid-cols-2"><label className="block text-sm font-semibold text-slate-800">配信方式<select value={video.sourceType} onChange={event => setVideo({ ...video, sourceType: event.target.value as VideoSourceType })} className="mt-2 w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm"><option value="youtube">YouTube</option><option value="vimeo">Vimeo</option><option value="direct">直接動画URL</option><option value="storage">Manusストレージ</option></select></label><Field label="動画URL" value={video.videoUrl} hint="HTTPSの公開URL" onChange={value => setVideo({ ...video, videoUrl: value })} /></div><ImageAssetField label="サムネイル画像" value={video.thumbnailUrl} onChange={value => setVideo({ ...video, thumbnailUrl: value })} alt={video.thumbnailAlt} onAltChange={value => setVideo({ ...video, thumbnailAlt: value })} recommendedAlt={video.title ? `${video.title}のサムネイル画像` : "動画内容を表すサムネイル画像"} /><div className="grid gap-4 md:grid-cols-2"><Field label="公開日時" value={video.publishedAt ?? ""} type="datetime-local" onChange={value => setVideo({ ...video, publishedAt: value ? new Date(value).toISOString() : null })} /><Field label="並び順" value={String(video.sortOrder)} onChange={value => setVideo({ ...video, sortOrder: Number(value) || 0 })} /></div><Toggle label="公開する" checked={video.isPublished} note="公開後は /videos/スラッグ で閲覧できます。" onChange={value => setVideo({ ...(videoRef.current ?? video), isPublished: value })} /><div className="flex gap-3"><button type="button" onClick={saveVideo} disabled={busy} className="inline-flex items-center gap-2 rounded-md bg-sky-600 px-4 py-2.5 text-sm font-bold text-white disabled:opacity-60"><Save size={15} />保存</button>{video.id && <button type="button" onClick={removeVideo} disabled={busy} className="inline-flex items-center gap-2 rounded-md border border-rose-200 px-4 py-2.5 text-sm font-bold text-rose-700"><Trash2 size={15} />削除</button>}</div></div> : null}</div> : <div className="flex min-h-[480px] items-center justify-center text-center text-sm text-slate-500"><p>左の一覧から選択するか、新規作成してください。</p></div>}</section>
    </div>
  </main>{isPreviewOpen && previewPath && <LivePreviewPanel title={selected?.title || (isBlog ? "ブログ記事" : "動画")} source={previewPath} revision={previewRevision} onClose={() => setIsPreviewOpen(false)} onRefresh={() => setPreviewRevision(current => current + 1)} />}</div></DashboardLayout>;
}
