import { Client } from "@replit/object-storage";
import * as fs from "fs";
import * as path from "path";

const SOCIAL_IMAGES_PREFIX = "social-images/";

let client: Client | null = null;

function getClient(): Client | null {
  if (client) return client;
  try {
    const bucketId = process.env.DEFAULT_OBJECT_STORAGE_BUCKET_ID;
    if (!bucketId) {
      console.warn("[ImageStorage] No DEFAULT_OBJECT_STORAGE_BUCKET_ID set");
      return null;
    }
    client = new Client({ bucketId });
    return client;
  } catch (e) {
    console.warn("[ImageStorage] Object Storage not available:", (e as Error).message);
    return null;
  }
}

export async function uploadSocialImage(localFilePath: string): Promise<boolean> {
  const c = getClient();
  if (!c) return false;

  const filename = path.basename(localFilePath);
  const objectName = SOCIAL_IMAGES_PREFIX + filename;

  try {
    if (!fs.existsSync(localFilePath)) {
      console.warn(`[ImageStorage] File not found: ${localFilePath}`);
      return false;
    }

    const result = await c.uploadFromFilename(objectName, localFilePath, { compress: false });
    if (result.ok) {
      console.log(`[ImageStorage] Uploaded: ${filename}`);
      return true;
    } else {
      console.error(`[ImageStorage] Upload failed for ${filename}:`, result.error);
      return false;
    }
  } catch (e) {
    console.error(`[ImageStorage] Upload error for ${filename}:`, (e as Error).message);
    return false;
  }
}

export async function downloadSocialImage(filename: string): Promise<Buffer | null> {
  const c = getClient();
  if (!c) return null;

  const objectName = SOCIAL_IMAGES_PREFIX + filename;

  try {
    const result = await c.downloadAsBytes(objectName, { decompress: false });
    if (result.ok) {
      return result.value[0];
    }
    return null;
  } catch {
    return null;
  }
}

export async function socialImageExists(filename: string): Promise<boolean> {
  const c = getClient();
  if (!c) return false;

  const objectName = SOCIAL_IMAGES_PREFIX + filename;

  try {
    const result = await c.exists(objectName);
    return result.ok && result.value === true;
  } catch {
    return false;
  }
}

export async function bulkUploadExistingImages(dir: string): Promise<{ uploaded: number; failed: number; skipped: number }> {
  const c = getClient();
  if (!c) return { uploaded: 0, failed: 0, skipped: 0 };

  let uploaded = 0, failed = 0, skipped = 0;

  if (!fs.existsSync(dir)) return { uploaded, failed, skipped };

  const files = fs.readdirSync(dir).filter(f =>
    f.endsWith(".jpeg") || f.endsWith(".jpg") || f.endsWith(".png") || f.endsWith(".webp")
  );

  console.log(`[ImageStorage] Bulk upload: ${files.length} images from ${dir}`);

  for (const file of files) {
    const objectName = SOCIAL_IMAGES_PREFIX + file;
    try {
      const exists = await c.exists(objectName);
      if (exists.ok && exists.value) {
        skipped++;
        continue;
      }

      const filePath = path.join(dir, file);
      const result = await c.uploadFromFilename(objectName, filePath, { compress: false });
      if (result.ok) {
        uploaded++;
      } else {
        failed++;
      }
    } catch {
      failed++;
    }
  }

  console.log(`[ImageStorage] Bulk upload complete: ${uploaded} uploaded, ${skipped} already existed, ${failed} failed`);
  return { uploaded, failed, skipped };
}
