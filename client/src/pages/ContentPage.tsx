/**
 * Design reminder — Editorial content page:
 * Pages created in CMS retain EMULABO's restrained navy/off-white editorial system,
 * with reading width, evidence-led imagery, and a single direct action.
 */
import { ArrowLeft, ArrowRight, MoveUpRight } from "lucide-react";
import { useParams } from "wouter";
import { trpc } from "@/lib/trpc";
import { DEFAULT_SITE_CONTENT } from "@shared/cms";
import { CtaLink, type CtaAudience } from "@/components/CtaLink";

export default function ContentPage() {
  const params = useParams<{ slug: string }>();
  const { data: page, isLoading } = trpc.sitePages.publicBySlug.useQuery({ slug: params.slug });
  const { data: siteContent } = trpc.siteContent.public.useQuery(undefined, { staleTime: 60_000 });
  const content = siteContent ?? DEFAULT_SITE_CONTENT;
  const isPersonalPage = params.slug === content.audiences.personal.href.replace(/^\//, "");
  const isCorporatePage = params.slug === content.audiences.corporate.href.replace(/^\//, "");
  const audience: CtaAudience = isPersonalPage ? "personal" : isCorporatePage ? "corporate" : "general";
  const cta = isPersonalPage ? content.resources.personal : { label: page?.ctaLabel ?? "", url: page?.ctaUrl ?? "" };
  const decisionGuide = isPersonalPage ? {
    title: "初回体験で確認すること",
    items: ["現在の身体の状態・生活リズム・運動経験", "目標に対して無理なく続けられる進め方", "対面またはオンラインを含む、次の一歩の選択肢"],
    note: "契約を前提にせず、まず現在地と進め方を整理します。",
  } : isCorporatePage ? {
    title: "無料相談で確認すること",
    items: ["教育・評価・現場運用・AI活用のどこに課題があるか", "優先して整えるべき領域と、支援できる範囲", "研修体系・評価基準・運用ルールなど、実装までの進め方"],
    note: "課題が整理できていない段階でも、現在の状況から一緒に論点を整理します。",
  } : null;

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
        {decisionGuide && <aside className="mt-12 border-y border-slate-300 py-7 text-left"><p className="font-mono text-xs tracking-[.14em] text-sky-700">BEFORE YOU CONTACT</p><h2 className="mt-3 text-2xl font-bold tracking-[-.045em] text-[#102845]">{decisionGuide.title}</h2><ul className="mt-5 space-y-3 text-sm leading-7 text-slate-700">{decisionGuide.items.map(item => <li key={item} className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-500" />{item}</li>)}</ul><p className="mt-5 text-sm leading-7 text-slate-600">{decisionGuide.note}</p></aside>}
        {cta.url && <div className="mt-10" style={{ textAlign: page.ctaAlign }}><CtaLink href={cta.url} tracking={{ audience, action: isPersonalPage ? "trial" : "consultation", placement: `${params.slug}_page` }} className="inline-flex items-center gap-3 bg-[#5ba9d9] px-5 py-4 text-sm font-bold text-[#07192e] transition hover:bg-white hover:shadow-lg">{cta.label || "無料オンライン相談を予約する"}{cta.url.startsWith("http") ? <MoveUpRight size={17} /> : <ArrowRight size={17} />}</CtaLink></div>}
      </div>
    </div>
  </article><footer className="border-t border-slate-300 px-6 py-8"><div className="mx-auto flex max-w-6xl justify-between text-xs text-slate-500"><span>© 2026 EMULABO</span><a href="/">トップへ戻る</a></div></footer></main>;
}
