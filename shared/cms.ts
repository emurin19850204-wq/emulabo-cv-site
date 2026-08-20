export const CMS_CONTENT_SLUG = "emulabo-site";

export type TextAlign = "left" | "center" | "right";
export type CmsSignal = { number: string; unit: string; label: string };
export type CmsService = { number: string; title: string; lead: string; text: string; examples: string[] };
export type CmsFaq = { question: string; answer: string };
export type CmsAudience = { eyebrow: string; title: string; text: string; href: string; ctaLabel: string };
export type CmsResource = { label: string; url: string };

export type CmsContent = {
  contactUrl: string;
  hero: { eyebrow: string; title: string; description: string; emphasis: string; note: string; align: TextAlign };
  assets: { heroImageUrl: string; profileImageUrl: string; caseImageUrl: string; consultationImageUrl: string; workshopImageUrl: string; operationsImageUrl: string };
  audiences: { corporate: CmsAudience; personal: CmsAudience };
  resources: { corporate: CmsResource; personal: CmsResource };
  signals: CmsSignal[];
  services: CmsService[];
  caseStudy: { title: string; challenge: string; action: string; outcome: string; scope: string };
  profile: { name: string; heading: string; quote: string; bio: string; credentials: string[] };
  faqs: CmsFaq[];
  finalCta: { title: string; text: string; note: string; align: TextAlign };
};

export const DEFAULT_SITE_CONTENT: CmsContent = {
  contactUrl: "https://emulabo.com/contact",
  hero: {
    eyebrow: "FITNESS BUSINESS × EDUCATION × AI",
    title: "育成の「属人化」を、\n組織の「仕組み」に。",
    description: "研修を作るだけではなく、",
    emphasis: "教育設計・評価制度・現場運用・AI活用まで一気通貫で設計。",
    note: "課題が整理できていない段階でも構いません｜オンライン30分",
    align: "left",
  },
  assets: {
    heroImageUrl: "/manus-storage/emulabo-hero-education-system_30d64fc5.jpg",
    profileImageUrl: "/manus-storage/emulabo-operations-brief_316f1942.jpg",
    caseImageUrl: "/manus-storage/emulabo-knowledge-structure_3d50d57d.jpg",
    consultationImageUrl: "/manus-storage/emulabo-consultation-reference_ee3b7833.jpg",
    workshopImageUrl: "/manus-storage/emulabo-training-workshop-v2_c473faf8.jpg",
    operationsImageUrl: "/manus-storage/emulabo-operations-team-v2_27fe7fc4.jpg",
  },
  audiences: {
    corporate: {
      eyebrow: "FOR CORPORATIONS",
      title: "法人のお客様",
      text: "研修、育成制度、現場運用、AI活用を組織の仕組みに変えたい方へ。",
      href: "/corporate",
      ctaLabel: "法人向け支援を見る",
    },
    personal: {
      eyebrow: "FOR PERSONAL",
      title: "個人のお客様",
      text: "続けられる運動習慣や、身体の悩みを根拠と手順から整理したい方へ。",
      href: "/personal",
      ctaLabel: "初回体験の内容を見る",
    },
  },
  resources: {
    corporate: {
      label: "法人向けサービス資料をダウンロード",
      url: "https://storage.googleapis.com/studio-design-asset-files/projects/moWvBGELW6/s-1x1_6c62aa82-f1aa-4bd1-8f62-1d89053651b3.pdf",
    },
    personal: { label: "初回体験を申し込む", url: "https://emulabo.com/contact" },
  },
  signals: [
    { number: "15", unit: "YEARS", label: "大手フィットネスクラブ勤務" },
    { number: "1,000+", unit: "PEOPLE", label: "育成に携わったトレーナー" },
    { number: "40", unit: "STORES", label: "教育設計対象店舗" },
    { number: "700", unit: "PEOPLE", label: "教育設計対象トレーナー規模" },
    { number: "8", unit: "COMPANIES", label: "法人支援実績" },
  ],
  services: [
    { number: "01", title: "研修・育成設計", lead: "誰が教えても、一定品質になる教育システムへ。", text: "新人研修から継続教育、社内ライセンス制度まで。属人的な教育を、組織で再現できる仕組みに変換します。", examples: ["新人研修", "継続研修", "研修カリキュラム", "社内ライセンス", "認定試験", "評価基準", "講師育成"] },
    { number: "02", title: "仕組み化・運用支援", lead: "作って終わるマニュアルではなく、現場で使われ続ける仕組みへ。", text: "教育・評価・店舗オペレーションを切り離さず、現場に定着する運用の形まで設計します。", examples: ["業務標準化", "マニュアル", "評価制度", "店舗オペレーション", "KPI設計", "ナレッジ管理", "教育運用"] },
    { number: "03", title: "AI活用・制作支援", lead: "導入するだけでなく、日常業務に組み込まれる状態へ。", text: "AIを目的にせず、業務時間・成果物品質・知識共有に変化が出るところまで、教育と実装を支援します。", examples: ["生成AI研修", "AI業務設計", "プロンプト設計", "AI教材", "社内ナレッジAI化", "業務DX", "AIツール制作"] },
  ],
  caseStudy: { title: "40店舗規模の\n教育制度設計", challenge: "店舗ごとに教育品質が異なる", action: "研修体系・評価基準・認定制度を再設計", outcome: "「どこまでできれば合格か」を共通化", scope: "教育設計／評価基準／認定制度" },
  profile: { name: "繪村 篤史", heading: "現場を知っているから、\n机上の教育設計で終わらない。", quote: "教育を作る人ではなく、\n教育が「使われる状態」を作る人。", bio: "大手フィットネスクラブで15年、延べ1,000名以上のトレーナー育成に携わってきました。40店舗・約700名規模の教育体系から、商品設計、現場運用、AI・DXまで。教育設計を実務で機能させるための支援を行います。", credentials: ["NSCA-CSCS", "NSCA-CPT"] },
  faqs: [
    { question: "まだ課題が整理できていなくても相談できますか？", answer: "はい。むしろその段階からご相談ください。現状を整理し、どこから着手すべきか一緒に確認します。" },
    { question: "研修だけの依頼も可能ですか？", answer: "可能です。研修単体の設計から、評価・運用を含めた体系的な支援まで、課題に合わせてご相談いただけます。" },
    { question: "小規模な会社でも相談できますか？", answer: "可能です。店舗数・スタッフ数・事業フェーズに合わせて、無理のない設計をご提案します。" },
    { question: "AI導入だけでも相談できますか？", answer: "可能です。ツール導入そのものではなく、どの業務に組み込めば成果につながるかという観点から整理します。" },
    { question: "オンライン対応は可能ですか？", answer: "可能です。初回の無料相談はオンラインで実施します。" },
    { question: "相談したら契約する必要がありますか？", answer: "無料相談の時点で契約を前提とするものではありません。現状と方向性を整理する場としてご利用ください。" },
  ],
  finalCta: { title: "「何から変えればいいか」\nから、一緒に整理します。", text: "育成、評価制度、現場運用、AI活用。問題が一つではないからこそ、最初から解決策を決める必要はありません。まず現在の状況を聞かせてください。", note: "オンライン30分｜相談無料", align: "left" },
};

export function parseCmsContent(raw: string | null | undefined): CmsContent {
  if (!raw) return DEFAULT_SITE_CONTENT;
  try {
    const candidate = JSON.parse(raw) as Partial<CmsContent>;
    return {
      ...DEFAULT_SITE_CONTENT,
      ...candidate,
      hero: { ...DEFAULT_SITE_CONTENT.hero, ...candidate.hero },
      assets: { ...DEFAULT_SITE_CONTENT.assets, ...candidate.assets },
      audiences: {
        corporate: { ...DEFAULT_SITE_CONTENT.audiences.corporate, ...candidate.audiences?.corporate },
        personal: { ...DEFAULT_SITE_CONTENT.audiences.personal, ...candidate.audiences?.personal },
      },
      resources: {
        corporate: { ...DEFAULT_SITE_CONTENT.resources.corporate, ...candidate.resources?.corporate },
        personal: { ...DEFAULT_SITE_CONTENT.resources.personal, ...candidate.resources?.personal },
      },
      signals: candidate.signals?.length ? candidate.signals : DEFAULT_SITE_CONTENT.signals,
      services: candidate.services?.length ? candidate.services : DEFAULT_SITE_CONTENT.services,
      caseStudy: { ...DEFAULT_SITE_CONTENT.caseStudy, ...candidate.caseStudy },
      profile: { ...DEFAULT_SITE_CONTENT.profile, ...candidate.profile },
      faqs: candidate.faqs?.length ? candidate.faqs : DEFAULT_SITE_CONTENT.faqs,
      finalCta: { ...DEFAULT_SITE_CONTENT.finalCta, ...candidate.finalCta },
    };
  } catch {
    return DEFAULT_SITE_CONTENT;
  }
}
