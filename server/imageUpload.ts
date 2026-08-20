import type { Express, Request, Response } from "express";
import multer from "multer";
import { sdk } from "./_core/sdk";
import { storagePut } from "./storage";

const ACCEPTED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const imageUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_IMAGE_BYTES, files: 1 },
  fileFilter: (_req, file, callback) => callback(null, ACCEPTED_IMAGE_TYPES.has(file.mimetype)),
});

function safeFilename(value: string) {
  return value.replace(/[^a-zA-Z0-9._-]/g, "-").slice(0, 160) || "image";
}

export function registerImageUploadRoute(app: Express) {
  app.post("/api/uploads/image", (req, res, next) => {
    imageUpload.single("file")(req, res, error => {
      if (!error) return next();
      const status = error instanceof multer.MulterError && error.code === "LIMIT_FILE_SIZE" ? 413 : 400;
      return res.status(status).json({ error: status === 413 ? "画像は10MB以下にしてください。" : "JPEG、PNG、WebP、GIFの画像を1件選択してください。" });
    });
  }, async (req: Request, res: Response) => {
    try {
      const user = await sdk.authenticateRequest(req);
      if (!user || user.role !== "admin") return res.status(403).json({ error: "管理者権限が必要です。" });

      const file = req.file;
      if (!file || !ACCEPTED_IMAGE_TYPES.has(file.mimetype)) return res.status(415).json({ error: "JPEG、PNG、WebP、GIFのみアップロードできます。" });
      if (file.size === 0) return res.status(400).json({ error: "画像ファイルを受け取れませんでした。" });
      const filename = safeFilename(file.originalname);
      const stored = await storagePut(`cms/images/${Date.now()}-${filename}`, file.buffer, file.mimetype);
      return res.status(201).json(stored);
    } catch (error) {
      console.error("[CMS image upload]", error);
      return res.status(500).json({ error: "画像の保存に失敗しました。もう一度お試しください。" });
    }
  });
}
