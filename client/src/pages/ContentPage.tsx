/**
 * Design reminder — Editorial content page:
 * Pages created in CMS retain EMULABO's restrained navy/off-white editorial system,
 * with reading width, evidence-led imagery, and a single direct action.
 */
import { ArrowLeft, ArrowRight, MoveUpRight } from "lucide-react";
import { useParams } from "wouter";
import { trpc } from "@/lib/trpc";

export default function ContentPage() {
  const params = useParams<{ slug: string }>();
  const { data: page, isLoading } = trpc.sitePages.publicBySlug.useQuery({ slug: params.slug });

  if (isLoading) return <main className="min-h-screen bg-[#f5f3ee] px-6 pt-32 text-[#102845]"><div className="mx-auto max-w-5xl animate-pulse"><div className="h-3 w-32 bg-slate-200" /><div className="mt-7 h-20 max-w-3xl bg-slate-200" /></div></main>;
  if (!page) return <main className="flex min-h-screen items-center justify-center bg-[#f5f3ee] px-6 text-center text-[#102845]"><div><p className="font-mono text-xs tracking-[.18em] text-sky-700">404 / PAGE NOT FOUND</p><h1 className="mt-5 text-4xl font-bold tracking-[-.06em]">ページが見つかりません。</h1><a href="/" className="mt-8 inline-flex items-center gap-2 border-b border-current pb-2 text-sm font-bold">トップページへ戻る <ArrowLeft size={16} /></a></div></main>;

  return <main className="min-h-screen bg-[#f5f3ee] pt-24 text-[#102845]"><article>
    <header className="mx-auto max-w-6xl px-6 py-16 md:py-24" style={{ textAlign: page.headerAlign }}>
      <a href="/" className="inline-flex items-center gap-2 font-mono text-xs tracking-[.14em] text-sky-700 transition hover:text-sky-900"><ArrowLeft size={14} /> EMULABO</a>
      <p className="mt-12 whitespace-pre-line font-mono text-xs tracking-[.16em] text-sky-700">{page.eyebrow}</p>
      <h1 className="mt-5 max-w-4xl whitespace-pre-line text-4xl font-extrabold leading-[1.18] tracking-[-.07em] md:text-7xl" style={{ marginInline: page.headerAlign === "center" ? "auto" : page.headerAlign === "right" ? "0 0 0 auto" : undefined }}>{page.title}</h1>
      <p className="mt-8 max-w-2xl whitespace-pre-line text-base leading-8 text-slate-600 md:text-lg" style={{ marginInline: page.headerAlign === "center" ? "auto" : page.headerAlign === "right" ? "0 0 0 auto" : undefined }}>{page.summary}</p>
    </header>
    {page.imageUrl && <div className="mx-auto max-w-6xl px-6"><img src={page.imageUrl} alt={page.imageAlt || page.title} className="h-[240px] w-full object-cover md:h-[500px]" /></div>}
    <div className="mx-auto grid max-w-6xl gap-12 px-6 py-16 md:grid-cols-[180px_minmax(0,720px)] md:py-24">
      <p className="font-mono text-xs tracking-[.16em] text-slate-500">EMULABO / INSIGHT</p>
      <div className="space-y-7 text-[15px] leading-8 text-slate-700" style={{ textAlign: page.bodyAlign }}>
        {page.body.split(/\n\s*\n/).map((paragraph, index) => <p className="whitespace-pre-line" key={`${paragraph}-${index}`}>{paragraph}</p>)}
        {page.ctaUrl && <div className="mt-10" style={{ textAlign: page.ctaAlign }}><a href={page.ctaUrl} className="inline-flex items-center gap-3 bg-[#5ba9d9] px-5 py-4 text-sm font-bold text-[#07192e] transition hover:bg-white hover:shadow-lg">{page.ctaLabel || "無料オンライン相談を予約する"}{page.ctaUrl.startsWith("http") ? <MoveUpRight size={17} /> : <ArrowRight size={17} />}</a></div>}
      </div>
    </div>
  </article><footer className="border-t border-slate-300 px-6 py-8"><div className="mx-auto flex max-w-6xl justify-between text-xs text-slate-500"><span>© 2026 EMULABO</span><a href="/">トップへ戻る</a></div></footer></main>;
}
