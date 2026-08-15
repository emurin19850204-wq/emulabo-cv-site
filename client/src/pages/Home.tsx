/**
 * Design reminder — Operational Intelligence:
 * A precise editorial B2B experience: off-white space, deep navy structure,
 * controlled signal blue, asymmetric information rhythm, and one clear consultation CTA.
 */
import { useEffect, useState } from "react";
import {
  ArrowDownRight,
  ArrowRight,
  ChevronDown,
  Menu,
  MoveUpRight,
  Plus,
  X,
} from "lucide-react";

const CONTACT_URL = "https://emulabo.com/contact";

const problemItems = [
  "店長によって、新人の育ち方が違う。",
  "研修を実施しても、現場の行動が変わらない。",
  "評価基準が曖昧で、何を教えるべきか分からない。",
  "優秀なスタッフのノウハウが、個人の中に留まっている。",
  "AIを導入したが、現場ではほとんど使われていない。",
  "店舗が増えるほど、教育品質を管理できなくなる。",
];

const services = [
  {
    number: "01",
    title: "研修・育成設計",
    lead: "誰が教えても、一定品質になる教育システムへ。",
    text: "新人研修から継続教育、社内ライセンス制度まで。属人的な教育を、組織で再現できる仕組みに変換します。",
    examples: ["新人研修", "継続研修", "研修カリキュラム", "社内ライセンス", "認定試験", "評価基準", "講師育成"],
  },
  {
    number: "02",
    title: "仕組み化・運用支援",
    lead: "作って終わるマニュアルではなく、現場で使われ続ける仕組みへ。",
    text: "教育・評価・店舗オペレーションを切り離さず、現場に定着する運用の形まで設計します。",
    examples: ["業務標準化", "マニュアル", "評価制度", "店舗オペレーション", "KPI設計", "ナレッジ管理", "教育運用"],
  },
  {
    number: "03",
    title: "AI活用・制作支援",
    lead: "導入するだけでなく、日常業務に組み込まれる状態へ。",
    text: "AIを目的にせず、業務時間・成果物品質・知識共有に変化が出るところまで、教育と実装を支援します。",
    examples: ["生成AI研修", "AI業務設計", "プロンプト設計", "AI教材", "社内ナレッジAI化", "業務DX", "AIツール制作"],
  },
];

const transformations = [
  ["教育担当者しか教えられない", "誰が教えても一定品質"],
  ["研修して終わり", "現場行動まで評価できる"],
  ["スタッフごとにやり方が違う", "組織の共通基準がある"],
  ["AIを試しているだけ", "AIが日常業務に組み込まれている"],
  ["ノウハウが個人に蓄積", "組織の知識として蓄積"],
];

const processSteps = [
  ["01", "無料相談", "現状・課題・目標を整理。"],
  ["02", "課題整理", "人・教育・業務・AIの観点から構造化。"],
  ["03", "設計", "研修・制度・業務フローを設計。"],
  ["04", "実装", "実際の現場へ導入。"],
  ["05", "検証・改善", "運用結果から改善。"],
  ["06", "標準化", "組織内で継続できる状態へ。"],
];

const faqs = [
  ["まだ課題が整理できていなくても相談できますか？", "はい。むしろその段階からご相談ください。現状を整理し、どこから着手すべきか一緒に確認します。"],
  ["研修だけの依頼も可能ですか？", "可能です。研修単体の設計から、評価・運用を含めた体系的な支援まで、課題に合わせてご相談いただけます。"],
  ["小規模な会社でも相談できますか？", "可能です。店舗数・スタッフ数・事業フェーズに合わせて、無理のない設計をご提案します。"],
  ["AI導入だけでも相談できますか？", "可能です。ツール導入そのものではなく、どの業務に組み込めば成果につながるかという観点から整理します。"],
  ["オンライン対応は可能ですか？", "可能です。初回の無料相談はオンラインで実施します。"],
  ["相談したら契約する必要がありますか？", "無料相談の時点で契約を前提とするものではありません。現状と方向性を整理する場としてご利用ください。"],
];

function SectionLabel({ children, dark = false }: { children: string; dark?: boolean }) {
  return <p className={`section-label ${dark ? "section-label--dark" : ""}`}>{children}</p>;
}

function PrimaryCta({ className = "" }: { className?: string }) {
  return (
    <a className={`button button--primary ${className}`} href={CONTACT_URL}>
      無料オンライン相談を予約する <ArrowRight size={17} aria-hidden="true" />
    </a>
  );
}

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 28);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="site-shell">
      <a className="skip-link" href="#main-content">本文へ移動</a>

      <header className={`site-header ${scrolled ? "site-header--scrolled" : ""}`}>
        <div className="header-inner">
          <a className="brand" href="#top" aria-label="EMULABO トップへ">
            <img src="/manus-storage/emulabo-logo-symbol_160fa766.png" alt="" className="brand-symbol" />
            <span className="brand-lockup">EMULABO<i aria-hidden="true" /></span>
          </a>
          <nav className="desktop-nav" aria-label="主要ナビゲーション">
            <a href="#approach">考え方</a>
            <a href="#services">支援内容</a>
            <a href="#cases">実績</a>
            <a href="#profile">プロフィール</a>
          </nav>
          <div className="header-cta">
            <a href={CONTACT_URL} className="header-cta-link">無料相談を予約 <ArrowRight size={14} aria-hidden="true" /></a>
          </div>
          <button
            type="button"
            className="mobile-menu-button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "メニューを閉じる" : "メニューを開く"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
        <div className={`mobile-menu ${menuOpen ? "mobile-menu--open" : ""}`}>
          <a href="#approach" onClick={closeMenu}>考え方</a>
          <a href="#services" onClick={closeMenu}>支援内容</a>
          <a href="#cases" onClick={closeMenu}>実績</a>
          <a href="#profile" onClick={closeMenu}>プロフィール</a>
          <a href={CONTACT_URL} className="button button--primary" onClick={closeMenu}>無料相談を予約する <ArrowRight size={17} /></a>
        </div>
      </header>

      <main id="main-content">
        <section className="hero" id="top" aria-labelledby="hero-title">
          <div className="hero-image" aria-hidden="true" />
          <div className="hero-overlay" aria-hidden="true" />
          <div className="hero-grain" aria-hidden="true" />
          <div className="layout hero-layout">
            <div className="hero-copy">
              <p className="hero-eyebrow">FITNESS BUSINESS <span>×</span> EDUCATION <span>×</span> AI</p>
              <h1 id="hero-title">育成の「属人化」を、<br />組織の「仕組み」に。</h1>
              <p className="hero-description">研修を作るだけではなく、<strong>教育設計・評価制度・現場運用・AI活用まで一気通貫で設計。</strong><br />フィットネス事業の「人が育つ仕組み」をつくります。</p>
              <div className="hero-actions">
                <PrimaryCta />
                <a href="#services" className="button button--text">支援内容を見る <ArrowDownRight size={18} aria-hidden="true" /></a>
              </div>
              <p className="hero-note">課題が整理できていない段階でも構いません <span>｜</span> オンライン30分</p>
            </div>
            <aside className="hero-system" aria-label="支援領域">
              <div className="hero-brand-sigil"><img src="/manus-storage/emulabo-logo-symbol_160fa766.png" alt="" /><span>EMULABO<br />OPERATIONAL INTELLIGENCE</span></div>
              <div className="hero-system-top"><span>EMULABO METHOD</span><span>01—06</span></div>
              <p>知るだけで終わらせない。<br /><strong>現場で、続く状態まで。</strong></p>
              <div className="hero-system-line" />
              <div className="hero-system-bottom"><span>EDUCATION</span><span>OPERATIONS</span><span>AI</span></div>
            </aside>
          </div>
        </section>

        <section className="signal-strip" aria-label="EMULABOの実務経験">
          <div className="layout signal-grid">
            {[
              ["15", "YEARS", "大手フィットネスクラブ勤務"],
              ["1,000+", "PEOPLE", "育成に携わったトレーナー"],
              ["40", "STORES", "教育設計対象店舗"],
              ["700", "PEOPLE", "教育設計対象トレーナー規模"],
              ["8", "COMPANIES", "法人支援実績"],
            ].map(([number, unit, text]) => (
              <div className="signal-item" key={unit + text}>
                <strong>{number}<small>{unit}</small></strong>
                <span>{text}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="section problem-section" id="problems" aria-labelledby="problems-title">
          <div className="layout split-heading">
            <SectionLabel>01 — PROBLEM</SectionLabel>
            <div>
              <h2 id="problems-title">こんな状態に、<br />なっていませんか？</h2>
              <p className="section-intro">教育・運用・AI活用の課題は、日々の小さな違和感として現れます。<br className="desktop-only" />その違和感を、組織が前へ進むための論点に変えます。</p>
            </div>
          </div>
          <div className="layout problem-layout">
            <div className="problem-rail" aria-hidden="true"><span>DIAGNOSE</span></div>
            <div className="problem-grid">
              {problemItems.map((problem, index) => (
                <article className="problem-card" key={problem}>
                  <span>0{index + 1}</span>
                  <h3>{problem}</h3>
                  <ArrowDownRight size={22} aria-hidden="true" />
                </article>
              ))}
            </div>
          </div>
          <div className="layout problem-conclusion"><span>01</span><p>問題は、人ではなく<strong>「仕組み」</strong>かもしれません。</p><a href={CONTACT_URL}>課題を整理する <ArrowRight size={16} /></a></div>
        </section>

        <section className="section why-section" id="approach" aria-labelledby="why-title">
          <div className="layout why-layout">
            <SectionLabel>02 — WHY</SectionLabel>
            <div className="why-main">
              <h2 id="why-title">研修資料を渡すだけでは、<br /><em>現場は変わりません。</em></h2>
              <div className="why-body">
                <p>知識を伝えるだけでは、「知っている」状態までしかつくれません。必要なのは、知識が行動になり、評価され、現場に残り続けることです。</p>
                <div className="learning-chain" aria-label="学びが定着するプロセス">
                  {["知る", "できる", "評価される", "継続される"].map((item, index) => (
                    <div className="chain-item" key={item}><b>0{index + 1}</b><span>{item}</span></div>
                  ))}
                </div>
                <p className="why-emphasis">EMULABOは、<strong>教育 × 評価 × 現場運用 × AI</strong> を分断せず、一つの仕組みとして設計します。</p>
              </div>
            </div>
          </div>
        </section>

        <section className="section solution-section" aria-labelledby="solution-title">
          <div className="layout solution-heading">
            <SectionLabel dark>03 — SOLUTION</SectionLabel>
            <div><h2 id="solution-title">教育を「イベント」から、<br />「仕組み」へ。</h2><p>相談の先にあるのは、単発の研修ではありません。<br />組織が学び、実践し、改善を続ける循環です。</p></div>
          </div>
          <div className="layout solution-visual-wrap">
            <div className="solution-visual">
              <svg className="solution-orbit" viewBox="0 0 700 560" aria-hidden="true">
                <path d="M141 310 C141 134 305 76 448 116 C609 161 635 364 486 447 C332 533 129 478 113 326" fill="none" />
                <path d="M113 326 l3 -30 l24 16" fill="none" />
                <circle cx="141" cy="310" r="5" /><circle cx="291" cy="116" r="5" /><circle cx="526" cy="190" r="5" /><circle cx="510" cy="406" r="5" /><circle cx="276" cy="464" r="5" />
              </svg>
              <div className="orbit-center"><span>EMULABO</span><strong>現場で<br />動く仕組み</strong></div>
              {[
                ["01", "現状分析", "orbit-node--one"], ["02", "教育設計", "orbit-node--two"], ["03", "研修・実践", "orbit-node--three"], ["04", "評価・改善", "orbit-node--four"], ["05", "標準化", "orbit-node--five"], ["06", "AI・DX", "orbit-node--six"],
              ].map(([number, title, className]) => <div className={`orbit-node ${className}`} key={number}><b>{number}</b><span>{title}</span></div>)}
            </div>
            <p className="solution-caption"><span>THE OPERATING LOOP</span> 一度つくって終わらせず、運用の中で学びと改善が積み上がる状態を目指します。</p>
          </div>
        </section>

        <section className="section services-section" id="services" aria-labelledby="services-title">
          <div className="layout split-heading service-heading">
            <SectionLabel>04 — SERVICE</SectionLabel>
            <div><h2 id="services-title">教育と現場をつなぐ、<br />3つの支援。</h2><p className="section-intro">課題の一部だけを切り取らず、必要な領域を組み合わせて支援します。</p></div>
          </div>
          <div className="layout services-list">
            {services.map((service) => <article className="service-row" key={service.number}>
              <div className="service-num">{service.number}</div>
              <div className="service-title"><h3>{service.title}</h3><p>{service.lead}</p></div>
              <div className="service-detail"><p>{service.text}</p><ul>{service.examples.map((example) => <li key={example}>{example}</li>)}</ul></div>
            </article>)}
          </div>
          <div className="layout restrained-cta"><p>どの領域から着手すべきか、まだ決まっていなくても構いません。</p><PrimaryCta /></div>
        </section>

        <section className="section change-section" aria-labelledby="change-title">
          <div className="layout split-heading"><SectionLabel>05 — BEFORE / AFTER</SectionLabel><div><h2 id="change-title">EMULABOが目指す変化</h2><p className="section-intro">教育を「実施すること」から、組織の力として「残ること」へ。</p></div></div>
          <div className="layout transformation-list">
            {transformations.map(([before, after], index) => <article className="transformation" key={before}>
              <span className="transformation-no">0{index + 1}</span>
              <p className="before"><small>BEFORE</small>{before}</p>
              <ArrowRight className="transformation-arrow" size={23} aria-hidden="true" />
              <p className="after"><small>AFTER</small>{after}</p>
            </article>)}
          </div>
        </section>

        <section className="section cases-section" id="cases" aria-labelledby="cases-title">
          <div className="layout split-heading"><SectionLabel dark>06 — CASES</SectionLabel><div><h2 id="cases-title">数字の先にある、<br />「できる状態」をつくる。</h2><p className="section-intro">何を導入したかではなく、現場にどんな共通基準が生まれたかを大切にします。</p></div></div>
          <div className="layout case-grid">
            <article className="case-card case-card--main">
              <div className="case-card-top"><span>CASE 01</span><span>EDUCATION SYSTEM</span></div>
              <h3>40店舗規模の<br />教育制度設計</h3>
              <dl><div><dt>課題</dt><dd>店舗ごとに教育品質が異なる</dd></div><div><dt>実施</dt><dd>研修体系・評価基準・認定制度を再設計</dd></div><div><dt>変化</dt><dd>「どこまでできれば合格か」を共通化</dd></div></dl>
              <div className="case-card-foot"><span>担当領域</span><p>教育設計／評価基準／認定制度</p></div>
            </article>
            <div className="case-art" role="img" aria-label="教育の仕組みを象徴する構造的なオブジェクト" />
          </div>
          <div className="layout case-cta"><p>自社の場合、どこから整えるべきか。<br />まずは現状を伺い、論点を整理します。</p><PrimaryCta /></div>
        </section>

        <section className="section process-section" aria-labelledby="process-title">
          <div className="layout split-heading"><SectionLabel>07 — PROCESS</SectionLabel><div><h2 id="process-title">相談から実装まで</h2><p className="section-intro">「コンサルを受けたら何が起こるか分からない」という不安をなくし、進め方を最初に共有します。</p></div></div>
          <div className="layout process-rail">
            {processSteps.map(([number, title, text], index) => <article className="process-step" key={number}>
              <div className="process-line"><span>{number}</span>{index < processSteps.length - 1 && <i />}</div>
              <div><h3>{title}</h3><p>{text}</p></div>
            </article>)}
          </div>
        </section>

        <section className="products-section" aria-labelledby="products-title">
          <div className="layout products-heading"><SectionLabel dark>08 — PRODUCTS</SectionLabel><div><h2 id="products-title">AIを語るだけではなく、<br />自分たちでもつくる。</h2><p>EMULABOでは、AI活用を提案するだけでなく、教育・業務領域のAIプロダクトを開発しています。その知見を法人支援にも還元します。</p></div></div>
          <div className="layout products-grid">
            <a className="product-card product-card--task" href="https://emulabo-trainer-business-os.netlify.app" target="_blank" rel="noreferrer"><span>AI WORKSPACE</span><h3>TaskAI<br /><i>Business OS</i></h3><p>日々の業務を「終わらせる」ための、AI業務ワークスペース。</p><small className="product-context">業務設計・成果物・実行速度を、現場で接続する。</small><b>プロダクトを見る <MoveUpRight size={17} /></b></a>
            <a className="product-card product-card--dictionary" href="https://emulabo-dictionary.netlify.app" target="_blank" rel="noreferrer"><span>KNOWLEDGE BASE</span><h3>EMULABO<br /><i>Trainer's Dictionary</i></h3><p>専門知識を、現場で使える言葉へ翻訳する知識の基盤。</p><small className="product-context">教育基準と実践知を、組織に残すための実装。</small><b>辞書を見る <MoveUpRight size={17} /></b></a>
          </div>
        </section>

        <section className="section profile-section" id="profile" aria-labelledby="profile-title">
          <div className="layout profile-grid">
            <div className="profile-image-wrap"><img src="/manus-storage/emulabo-operations-brief_316f1942.jpg" alt="教育運用の資料を整理する様子" /><span>FIELD<br />KNOWLEDGE<br />/ 15 YEARS</span></div>
            <div className="profile-copy"><SectionLabel>09 — PROFILE</SectionLabel><h2 id="profile-title">現場を知っているから、<br />机上の教育設計で終わらない。</h2><p className="profile-name">繪村 篤史</p><blockquote>教育を作る人ではなく、<br /><strong>教育が「使われる状態」を作る人。</strong></blockquote><p>大手フィットネスクラブで15年、延べ1,000名以上のトレーナー育成に携わってきました。40店舗・約700名規模の教育体系から、商品設計、現場運用、AI・DXまで。教育設計を実務で機能させるための支援を行います。</p><div className="credentials"><span>NSCA-CSCS</span><span>NSCA-CPT</span></div><a href={CONTACT_URL} className="profile-link">無料相談を予約する <ArrowRight size={17} /></a></div>
          </div>
        </section>

        <section className="section faq-section" aria-labelledby="faq-title">
          <div className="layout split-heading"><SectionLabel>10 — FAQ</SectionLabel><div><h2 id="faq-title">よくあるご質問</h2><p className="section-intro">相談の前に、ご不安な点をご確認ください。</p></div></div>
          <div className="layout faq-list">
            {faqs.map(([question, answer], index) => <article className={`faq-item ${openFaq === index ? "faq-item--open" : ""}`} key={question}><button type="button" onClick={() => setOpenFaq(openFaq === index ? null : index)} aria-expanded={openFaq === index}><span>Q{String(index + 1).padStart(2, "0")}</span><strong>{question}</strong><Plus size={20} aria-hidden="true" /></button><div className="faq-answer"><p>{answer}</p></div></article>)}
          </div>
        </section>

        <section className="final-cta" aria-labelledby="final-cta-title">
          <div className="final-cta-art" aria-hidden="true" />
          <div className="layout final-cta-inner"><div><SectionLabel dark>START WITH A CONVERSATION</SectionLabel><h2 id="final-cta-title">「何から変えればいいか」<br />から、一緒に整理します。</h2><p>育成、評価制度、現場運用、AI活用。問題が一つではないからこそ、最初から解決策を決める必要はありません。まず現在の状況を聞かせてください。</p><PrimaryCta /><span className="final-note">オンライン30分 <i>｜</i> 相談無料</span></div><div className="final-cta-index"><span>EMULABO</span><b>01<br />02<br />03<br />04</b><small>EDUCATION<br />OPERATIONS<br />AI</small></div></div>
        </section>
      </main>

      <footer className="site-footer"><div className="layout footer-inner"><a className="brand brand--footer" href="#top"><img src="/manus-storage/emulabo-logo-symbol_160fa766.png" alt="" className="brand-symbol" /><span className="brand-lockup">EMULABO<i aria-hidden="true" /></span></a><div><a href="https://emulabo.com/">emulabo.com</a><span>© 2026 EMULABO</span></div></div></footer>
      <a className="mobile-consultation" href={CONTACT_URL}>無料相談を予約する <ArrowRight size={16} /></a>
    </div>
  );
}
