import { ImagePlus, Loader2, RefreshCw, UploadCloud } from "lucide-react";
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

export function ImageAssetField({ label, value, onChange, alt, onAltChange, recommendedAlt, hint, previewAlt }: ImageAssetFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const uploadImage = async (file: File) => {
    setMessage("");
    if (!ACCEPTED_TYPES.includes(file.type as typeof ACCEPTED_TYPES[number])) {
      setMessage("JPEG、PNG、WebP、GIFの画像を選択してください。");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setMessage("画像は10MB以下にしてください。");
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file, file.name);
      const response = await fetch("/api/uploads/image", { method: "POST", body: formData });
      const payload = await response.json().catch(() => null) as { url?: string; error?: string } | null;
      const url = payload?.url;
      if (!response.ok || !url) throw new Error(payload?.error || `アップロードに失敗しました（${response.status}）。`);
      onChange(url);
      if (onAltChange && !alt && recommendedAlt) onAltChange(recommendedAlt);
      setMessage("アップロードしました。ページ全体の保存で公開設定へ反映されます。");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "アップロードに失敗しました。時間をおいて再試行してください。");
    } finally {
      setIsUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return <div className="rounded-lg border border-slate-200 bg-white p-4"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-sm font-semibold text-slate-800">{label}</p><p className="mt-1 text-xs leading-5 text-slate-500">{hint ?? "画像を選択してアップロードするか、既存の公開URLを入力してください。JPEG・PNG・WebP・GIF、10MB以下。"}</p></div><button type="button" onClick={() => inputRef.current?.click()} disabled={isUploading} className="inline-flex items-center gap-2 rounded-md bg-[#102845] px-3 py-2 text-xs font-bold text-white transition hover:bg-[#173c65] disabled:opacity-60"><UploadCloud size={15} />{isUploading ? "アップロード中…" : "画像を選択"}</button></div><input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="sr-only" onChange={event => { const file = event.target.files?.[0]; if (file) void uploadImage(file); }} />{value ? <img src={value} alt={previewAlt ?? alt ?? `${label}のプレビュー`} className="mt-4 h-40 w-full rounded-md bg-slate-100 object-cover" /> : <div className="mt-4 flex h-40 items-center justify-center rounded-md border border-dashed border-slate-300 bg-slate-50 text-xs text-slate-500"><ImagePlus size={18} className="mr-2" />画像を選択するとプレビューされます。</div>}<label className="mt-4 block"><span className="text-xs font-semibold text-slate-700">画像URL</span><input value={value} onChange={event => onChange(event.target.value)} placeholder="https://… または /manus-storage/…" className="mt-1.5 w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100" /></label>{onAltChange && <label className="mt-4 block"><span className="text-xs font-semibold text-slate-700">画像の代替テキスト</span><input value={alt ?? ""} onChange={event => onAltChange(event.target.value)} placeholder={recommendedAlt ?? "画像の内容を短く説明してください"} className="mt-1.5 w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100" /></label>}<p className="mt-3 min-h-5 text-xs leading-5" aria-live="polite">{isUploading ? <span className="inline-flex items-center gap-2 text-sky-700"><Loader2 size={13} className="animate-spin" />安全な保存先へアップロードしています。</span> : message ? <span className={message.includes("失敗") || message.includes("以下") || message.includes("選択してください") || message.includes("一致") ? "text-rose-700" : "text-emerald-700"}>{message}</span> : <span className="text-slate-500">既存URLの貼り付けにも対応しています。</span>}</p>{message.includes("失敗") && <button type="button" onClick={() => inputRef.current?.click()} className="inline-flex items-center gap-1 text-xs font-bold text-sky-700"><RefreshCw size={13} />もう一度選択する</button>}</div>;
}
