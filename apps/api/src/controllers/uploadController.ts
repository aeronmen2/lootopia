import type { Context } from "hono";
import { UploadService } from "../services/uploadService";

export class UploadController {
  static async uploadFile(c: Context) {
    try {
      const body = await c.req.parseBody();
      const file = body.file;

      if (!file || !(file instanceof File)) {
        return c.json({ success: false, message: "No file uploaded" }, 400);
      }

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const url = await UploadService.uploadFile(buffer, file.name, file.type);

      return c.json({ success: true, url });
    } catch (error) {
      return c.json({ success: false, message: "Upload failed", error: error instanceof Error ? error.message : error }, 500);
    }
  }
}
