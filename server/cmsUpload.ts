import express, { type Express } from "express";
import { sdk } from "./_core/sdk";
import { storagePut } from "./storage";

const SUPPORTED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

function safeFilename(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "-").slice(0, 160) || "image";
}

/**
 * Receives image bytes directly rather than base64 JSON so large images do not
 * pass through the API gateway's JSON inspection layer.
 */
export function registerCmsUploadRoute(app: Express) {
  app.post(
    "/api/cms/upload",
    express.raw({ type: "image/*", limit: "5mb" }),
    async (req, res) => {
      try {
        const user = await sdk.authenticateRequest(req);
        if (user.role !== "admin") {
          res.status(403).json({ error: "管理者権限が必要です。" });
          return;
        }

        const contentType = req.headers["content-type"]?.split(";")[0] ?? "";
        if (!SUPPORTED_IMAGE_TYPES.has(contentType)) {
          res.status(400).json({ error: "JPEG・PNG・WebP・GIF形式の画像を選択してください。" });
          return;
        }
        if (!Buffer.isBuffer(req.body) || req.body.length === 0) {
          res.status(400).json({ error: "画像データを受け取れませんでした。" });
          return;
        }

        const filename = safeFilename(decodeURIComponent(String(req.headers["x-file-name"] ?? "image")));
        const upload = await storagePut(`cms/images/${Date.now()}-${filename}`, req.body, contentType);
        res.status(201).json(upload);
      } catch (error) {
        console.error("[CMS Upload] Failed:", error);
        res.status(500).json({ error: "画像の保存に失敗しました。時間をおいて再度お試しください。" });
      }
    },
  );
}
