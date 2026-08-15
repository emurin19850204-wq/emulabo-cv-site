type UploadResult = { key: string; url: string; uploadUrl: string };
type RequestUpload = (input: { filename: string; contentType: "image/jpeg" | "image/png" | "image/webp" | "image/gif" }) => Promise<UploadResult>;

export async function uploadCmsImage(file: File, requestUpload: RequestUpload): Promise<Pick<UploadResult, "key" | "url">> {
  if (!/^image\/(jpeg|png|webp|gif)$/.test(file.type)) {
    throw new Error("JPEG・PNG・WebP・GIF形式の画像を選択してください。");
  }
  if (file.size > 5_000_000) {
    throw new Error("画像は5MB以下にしてください。");
  }

  const result = await requestUpload({ filename: file.name, contentType: file.type as "image/jpeg" | "image/png" | "image/webp" | "image/gif" });
  const response = await fetch(result.uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file,
  });
  if (!response.ok) {
    throw new Error("画像をストレージへ保存できませんでした。");
  }
  return { key: result.key, url: result.url };
}
