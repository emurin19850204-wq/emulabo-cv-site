import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { CtaLink } from "@/components/CtaLink";

function embedUrl(sourceType: string, url: string) {
  try {
    const parsed = new URL(url);
    if (sourceType === "youtube") {
      const id = parsed.searchParams.get("v") ?? parsed.pathname.split("/").filter(Boolean).pop();
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    if (sourceType === "vimeo") {
      const id = parsed.pathname.split("/").filter(Boolean).pop();
      return id ? `https://player.vimeo.com/video/${id}` : null;
    }
  } catch { return null; }
  return null;
}

export default function Videos({ slug }: { slug?: string }) {
  const list = trpc.videos.publicList.useQuery(undefined, { enabled: !slug });
  const detail = trpc.videos.publicBySlug.useQuery({ slug: slug ?? "" }, { enabled: Boolean(slug) });
  if (slug) {
    if (detail.isLoading) return <main className="container py-20">読み込み中…</main>;
    if (detail.isError) return <main className="container py-20"><h1 className="text-3xl font-bold">動画を取得できませんでした</h1><button type="button" onClick={() => detail.refetch()} className="mt-6 font-bold text-sky-700 underline">再読み込みする</button><Link href="/videos" className="ml-5 inline-block text-slate-600">動画一覧へ戻る</Link></main>;
    if (!detail.data) return <main className="container py-20"><h1 className="text-3xl font-bold">動画が見つかりません</h1><Link href="/videos" className="mt-6 inline-block text-sky-700">動画一覧へ戻る</Link></main>;
    const video = detail.data;
    const embed = embedUrl(video.sourceType, video.videoUrl);
    return <main className="container max-w-5xl py-16"><Link href="/videos" className="text-sm font-bold text-sky-700">← VIDEOS</Link><p className="mt-10 font-mono text-xs tracking-widest text-sky-700">EMULABO FIELD NOTE</p><h1 className="mt-4 text-4xl font-bold text-slate-950 md:text-5xl">{video.title}</h1><p className="mt-5 max-w-3xl leading-7 text-slate-600">{video.description}</p><div className="mt-10 aspect-video overflow-hidden rounded-2xl bg-slate-950">{embed ? <iframe src={embed} title={video.title} className="h-full w-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen /> : <video controls poster={video.thumbnailUrl || undefined} className="h-full w-full" src={video.videoUrl}>お使いのブラウザは動画再生に対応していません。</video>}</div><CtaLink href="https://emulabo.com/contact" tracking={{ audience: "general", action: "content", placement: "video_detail" }} className="mt-10 inline-flex rounded-md bg-sky-600 px-5 py-3 font-bold text-white">動画の内容を相談する</CtaLink></main>;
  }
  return <main className="container py-16"><p className="font-mono text-xs tracking-widest text-sky-700">EMULABO FIELD NOTE</p><h1 className="mt-3 text-4xl font-bold text-slate-950">動画</h1><p className="mt-4 max-w-2xl leading-7 text-slate-600">現場で使われる教育と運用の考え方を、動画で紹介します。</p><div className="mt-10 grid gap-6 md:grid-cols-2">{list.isLoading ? <p className="rounded-xl bg-slate-100 p-6 text-sm text-slate-600">動画を読み込んでいます…</p> : list.isError ? <div className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-800"><p>動画を取得できませんでした。</p><button type="button" onClick={() => list.refetch()} className="mt-3 font-bold underline">再読み込みする</button></div> : list.data?.length === 0 ? <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-600 md:col-span-2"><p>公開中の動画はまだありません。</p><CtaLink href="https://emulabo.com/contact" tracking={{ audience: "general", action: "content", placement: "video_empty" }} className="mt-3 inline-block font-bold text-sky-700">動画で相談内容を確認する</CtaLink></div> : list.data?.map(video => <Link key={video.id} href={`/videos/${video.slug}`} className="group overflow-hidden rounded-2xl border border-slate-200 bg-white">{video.thumbnailUrl && <img src={video.thumbnailUrl} alt={video.thumbnailAlt} className="aspect-video w-full object-cover transition duration-300 group-hover:scale-[1.02]" />}<div className="p-6"><h2 className="text-xl font-bold text-slate-950">{video.title}</h2><p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">{video.description}</p></div></Link>)}</div></main>;
}
