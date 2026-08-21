import { ChevronDown, Eye, ImagePlus, Info, Loader2, RefreshCw, RotateCcw, ShieldCheck, UploadCloud } from "lucide-react";
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
  return <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-50"><div className="flex items-center gap-2 border-b border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700"><Eye size={14} className="text-sky-700" />{label}</div>{src ? <img src={src} alt={alt} className="h-48 w-full object-cover" /> : <div className="flex h-48 items-center justify-center px-4 text-center text-xs leading-5 text-slate-500"><ImagePlus size={18} className="mr-2 shrink-0" />まだ写真は選ばれていません。</div>}</div>;
}

export function ImageAssetField({ label, value, onChange, alt, onAltChange, recommendedAlt, hint, previewAlt }: ImageAssetFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const originalUrlRef = useRef(value);
  const originalAltRef = useRef(alt ?? "");
  const [pendingUrl, setPendingUrl] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const guide = guideFor(label);
  const imageAlt = previewAlt ?? alt ?? `${label}のプレビュー`;
  const previewUrl = pendingUrl ?? value;
  const hasReplacement = Boolean(previewUrl && previewUrl !== originalUrlRef.current);
  const isError = message.includes("できません") || message.includes("大きすぎ") || message.includes("形式");

  const uploadImage = async (file: File) => {
    setMessage("");
    if (!ACCEPTED_TYPES.includes(file.type as typeof ACCEPTED_TYPES[number])) {
      setMessage("JPEG・PNG・WebP・GIFの写真を選んでください。ほかの形式は使えません。");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setMessage("写真が大きすぎます。10MB以下の写真を選んでください。");
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file, file.name);
      const response = await fetch("/api/uploads/image", { method: "POST", body: formData });
      const payload = await response.json().catch(() => null) as { url?: string; error?: string } | null;
      const url = payload?.url;
      if (!response.ok || !url) throw new Error(payload?.error || `写真を保存できませんでした（${response.status}）。`);
      setPendingUrl(url);
      setMessage("新しい写真を用意しました。表示を確認して「この写真を使う」を押してください。");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "写真を保存できませんでした。時間をおいて、もう一度試してください。");
    } finally {
      setIsUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const confirmPendingImage = () => {
    if (!pendingUrl) return;
    onChange(pendingUrl);
    if (onAltChange && !alt && recommendedAlt) onAltChange(recommendedAlt);
    setPendingUrl(null);
    setMessage("この写真を使う準備ができました。最後に、ページ下部の「変更を保存」を押してください。");
  };

  const restoreOriginal = () => {
    setPendingUrl(null);
    onChange(originalUrlRef.current);
    if (onAltChange) onAltChange(originalAltRef.current);
    setMessage("元の写真に戻しました。ページを保存しなければ、公開サイトは変わりません。");
  };

  return <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm" aria-label={`${label}の写真差し替え`}>
    <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-base font-bold text-slate-900">{label}</p><p className="mt-1 text-sm leading-6 text-slate-600">{hint ?? guide.purpose}</p></div><span className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-2.5 py-1 text-xs font-bold text-sky-800"><ShieldCheck size={13} />保存するまで公開されません</span></div>

    <div className="mt-4 rounded-lg border border-sky-100 bg-sky-50 p-3 text-sm leading-6 text-slate-700"><strong className="text-slate-900">かんたん3操作：</strong> <span className="font-bold text-sky-800">写真を選ぶ</span> → <span className="font-bold text-sky-800">この写真を使う</span> → ページ下部の <span className="font-bold text-sky-800">変更を保存</span></div>

    <div className="mt-4 flex flex-wrap gap-2"><button type="button" onClick={() => inputRef.current?.click()} disabled={isUploading} className="inline-flex items-center gap-2 rounded-lg bg-[#102845] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#173c65] disabled:cursor-wait disabled:opacity-60"><UploadCloud size={16} />{isUploading ? "写真を準備しています…" : "写真を選ぶ"}</button>{pendingUrl && <button type="button" onClick={confirmPendingImage} disabled={isUploading} className="inline-flex items-center gap-2 rounded-lg bg-sky-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-sky-700"><ShieldCheck size={16} />この写真を使う</button>}{hasReplacement && !pendingUrl && <button type="button" onClick={restoreOriginal} disabled={isUploading} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"><RotateCcw size={16} />元の写真に戻す</button>}</div>
    <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="sr-only" onChange={event => { const file = event.target.files?.[0]; if (file) void uploadImage(file); }} />

    <div className="mt-4"><p className="mb-2 text-sm font-bold text-slate-800">{pendingUrl ? "選んだ新しい写真" : "現在の写真"}</p><ImagePreview src={previewUrl} alt={imageAlt} label={pendingUrl ? "新しく選んだ写真" : "現在表示されている写真"} /></div>

    <p className="mt-3 min-h-5 text-sm leading-5" aria-live="polite">{isUploading ? <span className="inline-flex items-center gap-2 text-sky-700"><Loader2 size={15} className="animate-spin" />写真を安全な保存先へ送っています。少しお待ちください。</span> : message ? <span className={isError ? "text-rose-700" : "text-emerald-700"}>{message}</span> : <span className="text-slate-500">写真を選んだだけでは、公開サイトは変わりません。</span>}</p>
    {isError && <button type="button" onClick={() => inputRef.current?.click()} className="mt-2 inline-flex items-center gap-1 text-sm font-bold text-sky-700"><RefreshCw size={14} />もう一度、写真を選ぶ</button>}

    <details className="mt-4 rounded-lg border border-slate-200 bg-white"><summary className="flex cursor-pointer items-center justify-between gap-3 px-3 py-2.5 text-sm font-bold text-slate-700">詳しい設定・確認<ChevronDown size={16} className="text-slate-500" /></summary><div className="space-y-4 border-t border-slate-200 p-3">{hasReplacement && <div><p className="mb-2 text-sm font-bold text-slate-800">元の写真と比べる</p><div className="grid gap-3 sm:grid-cols-2"><ImagePreview src={originalUrlRef.current} alt={`元の${imageAlt}`} label="元の公開写真" /><ImagePreview src={previewUrl} alt={imageAlt} label="新しい写真" /></div></div>}{onAltChange && <label className="block rounded-lg border border-slate-200 bg-slate-50 p-3"><span className="flex items-center gap-1 text-sm font-bold text-slate-800"><Info size={15} className="text-sky-700" />写真の説明</span><span className="mt-1 block text-xs leading-5 text-slate-600">目が見えにくい方にも内容を伝える文章です。公開前に確認してください。</span><input value={alt ?? ""} onChange={event => onAltChange(event.target.value)} placeholder={recommendedAlt ?? "例：相談しながら資料を確認している様子"} className="mt-2 w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100" /></label>}<label className="block"><span className="text-xs font-bold text-slate-700">写真URL（URLが分かる場合だけ）</span><input value={value} onChange={event => { setPendingUrl(null); onChange(event.target.value); setMessage("写真URLを設定しました。最後にページ下部の「変更を保存」を押してください。"); }} placeholder="https://… または /manus-storage/…" className="mt-2 w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100" /></label><div className="rounded-lg bg-amber-50 p-3 text-xs leading-5 text-amber-950"><p><strong>おすすめ：</strong>{guide.example}</p><p><strong>おすすめの大きさ：</strong>{guide.size}</p><p><strong>切れないための注意：</strong>{guide.crop}</p><p><strong>避ける写真：</strong>{guide.avoid}</p></div></div></details>
  </section>;
}
