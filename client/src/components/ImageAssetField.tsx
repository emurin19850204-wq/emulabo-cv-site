import { CheckCircle2, ChevronDown, Eye, ImagePlus, Info, Loader2, RefreshCw, RotateCcw, ShieldCheck, UploadCloud } from "lucide-react";
import { useRef, useState } from "react";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"] as const;
const MAX_FILE_SIZE = 10 * 1024 * 1024;

type ImageAssetFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  alt?: string;
  onAltChange?: (value: string) => void;
  recommendedAlt?: string;
  hint?: string;
  previewAlt?: string;
};

function guideFor(label: string) {
  if (label.includes("ヒーロー")) return { purpose: "最初に目に入る大きな写真です。横長で、文字を重ねても顔や大事な部分が隠れにくい写真を選びます。", example: "会議・研修・相談の場面を、少し引いた距離から写した横長写真", size: "横1920 × 縦1080ピクセル以上（横長16:9）", crop: "見出しが左側に重なるため、人物や大事な場面は右側か中央に置かれた写真がおすすめです。", avoid: "顔が大きく切れている写真、暗すぎる写真、文字が多く入った画像" };
  if (label.includes("プロフィール")) return { purpose: "誰が支援するかを伝える写真です。本人、または相談・支援している様子が分かる写真を選びます。", example: "自然な表情の人物写真、資料を見ながら話している写真", size: "横1200 × 縦1500ピクセル以上（縦長4:5）", crop: "顔や手元が中央寄りにある写真を選ぶと、スマートフォンでも見切れにくくなります。", avoid: "顔が小さすぎる写真、ピントが合っていない写真" };
  if (label.includes("ブログ") || label.includes("サムネイル") || label.includes("動画")) return { purpose: "記事や動画の内容をひと目で伝える写真です。内容と関係がある、明るく見やすい写真を選びます。", example: "研修、運用、トレーニングなど本文のテーマが分かる写真", size: "横1600 × 縦900ピクセル以上（横長16:9）", crop: "一覧カードでは上下が少し切れる場合があるため、主役は写真の中央に入れてください。", avoid: "内容と関係がない写真、細かい文字が読めない画像" };
  return { purpose: "この場所の内容を伝える写真です。何をしている場面かが分かる、明るく見やすい写真を選びます。", example: "相談・研修・現場運用など、支援内容が伝わる写真", size: "横1600 × 縦1000ピクセル以上（少し横長）", crop: "人物や大事な物は、写真の中央付近に入れてください。端にあると画面サイズによって切れる場合があります。", avoid: "顔や大事な部分が切れている写真、暗すぎる写真" };
}

function ImagePreview({ src, alt, label }: { src: string; alt: string; label: string }) {
  return <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-50"><div className="flex items-center gap-2 border-b border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700"><Eye size={14} className="text-sky-700" />{label}</div>{src ? <img src={src} alt={alt} className="h-40 w-full object-cover" /> : <div className="flex h-40 items-center justify-center px-4 text-center text-xs leading-5 text-slate-500"><ImagePlus size={18} className="mr-2 shrink-0" />まだ画像は選ばれていません。</div>}</div>;
}

export function ImageAssetField({ label, value, onChange, alt, onAltChange, recommendedAlt, hint, previewAlt }: ImageAssetFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const originalUrlRef = useRef(value);
  const originalAltRef = useRef(alt ?? "");
  const [message, setMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [checked, setChecked] = useState(false);
  const guide = guideFor(label);
  const hasReplacement = Boolean(value && value !== originalUrlRef.current);
  const imageAlt = previewAlt ?? alt ?? `${label}のプレビュー`;

  const uploadImage = async (file: File) => {
    setMessage("");
    setChecked(false);
    if (!ACCEPTED_TYPES.includes(file.type as typeof ACCEPTED_TYPES[number])) {
      setMessage("JPEG・PNG・WebP・GIFの画像を選んでください。ほかの形式は使えません。");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setMessage("画像が大きすぎます。10MB以下の画像を選んでください。");
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file, file.name);
      const response = await fetch("/api/uploads/image", { method: "POST", body: formData });
      const payload = await response.json().catch(() => null) as { url?: string; error?: string } | null;
      const url = payload?.url;
      if (!response.ok || !url) throw new Error(payload?.error || `画像を保存できませんでした（${response.status}）。`);
      onChange(url);
      if (onAltChange && !alt && recommendedAlt) onAltChange(recommendedAlt);
      setMessage("新しい画像を用意しました。下の比較で確認してから、ページ全体を保存してください。");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "画像を保存できませんでした。時間をおいて、もう一度試してください。");
    } finally {
      setIsUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const restoreOriginal = () => {
    onChange(originalUrlRef.current);
    if (onAltChange) onAltChange(originalAltRef.current);
    setChecked(false);
    setMessage("現在の公開画像に戻しました。ページを保存しなければ、公開サイトは変わりません。");
  };

  const isError = message.includes("できません") || message.includes("大きすぎ") || message.includes("形式");

  return <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm" aria-label={`${label}の変更操作`}>
    <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-base font-bold text-slate-900">{label}</p><p className="mt-1 text-sm leading-6 text-slate-600">{hint ?? guide.purpose}</p></div><span className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-2.5 py-1 text-xs font-bold text-sky-800"><ShieldCheck size={13} />公開前に確認できます</span></div>

    <ol className="mt-4 grid gap-2 sm:grid-cols-3" aria-label="画像変更の3ステップ"><li className="rounded-lg bg-slate-50 p-3"><span className="text-xs font-extrabold text-sky-700">1. 選ぶ</span><p className="mt-1 text-xs leading-5 text-slate-600">写真を1枚選びます。形式はJPEG・PNG・WebP・GIF、10MB以下です。</p></li><li className="rounded-lg bg-slate-50 p-3"><span className="text-xs font-extrabold text-sky-700">2. 確認する</span><p className="mt-1 text-xs leading-5 text-slate-600">現在の画像と比べ、顔や大事な部分が切れていないかを見ます。</p></li><li className="rounded-lg bg-slate-50 p-3"><span className="text-xs font-extrabold text-sky-700">3. 保存する</span><p className="mt-1 text-xs leading-5 text-slate-600">最後に、このページの「変更を保存」を押すと公開サイトに反映されます。</p></li></ol>

    <div className="mt-4 flex flex-wrap gap-2"><button type="button" onClick={() => inputRef.current?.click()} disabled={isUploading} className="inline-flex items-center gap-2 rounded-lg bg-[#102845] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#173c65] disabled:cursor-wait disabled:opacity-60"><UploadCloud size={16} />{isUploading ? "画像を準備しています…" : "1. 画像を選ぶ"}</button>{hasReplacement && <button type="button" onClick={restoreOriginal} disabled={isUploading} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"><RotateCcw size={16} />現在の公開画像に戻す</button>}</div>
    <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="sr-only" onChange={event => { const file = event.target.files?.[0]; if (file) void uploadImage(file); }} />

    {hasReplacement ? <div className="mt-4"><p className="mb-2 text-sm font-bold text-slate-800">2. 新しい画像を確認する</p><div className="grid gap-3 sm:grid-cols-2"><ImagePreview src={originalUrlRef.current} alt={`現在の${imageAlt}`} label="現在の公開画像" /><ImagePreview src={value} alt={imageAlt} label="新しく選んだ画像" /></div></div> : <div className="mt-4"><p className="mb-2 text-sm font-bold text-slate-800">現在の公開画像</p><ImagePreview src={value} alt={imageAlt} label="今表示されている画像" /></div>}

    {onAltChange && <label className="mt-4 block rounded-lg border border-slate-200 bg-slate-50 p-3"><span className="flex items-center gap-1 text-sm font-bold text-slate-800"><Info size={15} className="text-sky-700" />画像の説明（目が見えにくい方にも内容を伝える文章）</span><span className="mt-1 block text-xs leading-5 text-slate-600">例：{recommendedAlt ?? "何をしている写真かを、短い文章で書きます。"}</span><input value={alt ?? ""} onChange={event => onAltChange(event.target.value)} placeholder={recommendedAlt ?? "例：相談しながら資料を確認している様子"} className="mt-2 w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100" /></label>}

    <label className="mt-4 flex cursor-pointer items-start gap-2 rounded-lg border border-sky-100 bg-sky-50 p-3 text-sm text-slate-700"><input type="checkbox" checked={checked} onChange={event => setChecked(event.target.checked)} className="mt-0.5 size-4 accent-sky-700" /><span><strong className="block text-slate-900">3. 確認しました</strong><span className="text-xs leading-5">新しい画像が用途に合っていることを確認しました。次に、このページの<strong>「変更を保存」</strong>を押してください。</span></span></label>

    <details className="mt-4 rounded-lg border border-slate-200 bg-white"><summary className="flex cursor-pointer items-center justify-between gap-3 px-3 py-2.5 text-sm font-bold text-slate-700">詳しい設定（URLを貼り付ける場合）<ChevronDown size={16} className="text-slate-500" /></summary><div className="border-t border-slate-200 p-3"><label className="block"><span className="text-xs font-bold text-slate-700">画像URL</span><span className="mt-1 block text-xs leading-5 text-slate-500">画像のURLが分かっている場合だけ使います。通常は上の「画像を選ぶ」で十分です。</span><input value={value} onChange={event => { setChecked(false); onChange(event.target.value); }} placeholder="https://… または /manus-storage/…" className="mt-2 w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100" /></label></div></details>

    <details className="mt-3 rounded-lg bg-amber-50 px-3 py-2.5 text-xs text-amber-950"><summary className="cursor-pointer font-bold">どんな写真を選べばよいですか？</summary><div className="mt-2 space-y-1 leading-5"><p><strong>おすすめ：</strong>{guide.example}</p><p><strong>おすすめの大きさ：</strong>{guide.size}</p><p><strong>切れないための注意：</strong>{guide.crop}</p><p><strong>避ける写真：</strong>{guide.avoid}</p></div></details>

    <p className="mt-3 min-h-5 text-sm leading-5" aria-live="polite">{isUploading ? <span className="inline-flex items-center gap-2 text-sky-700"><Loader2 size={15} className="animate-spin" />画像を安全な保存先へ送っています。少しお待ちください。</span> : message ? <span className={isError ? "text-rose-700" : "text-emerald-700"}>{message}</span> : checked ? <span className="inline-flex items-center gap-1 text-emerald-700"><CheckCircle2 size={15} />確認済みです。ページ下部の「変更を保存」を押してください。</span> : <span className="text-slate-500">画像を選んでも、ページを保存するまでは公開サイトは変わりません。</span>}</p>
    {isError && <button type="button" onClick={() => inputRef.current?.click()} className="mt-2 inline-flex items-center gap-1 text-sm font-bold text-sky-700"><RefreshCw size={14} />もう一度、画像を選ぶ</button>}
  </section>;
}
