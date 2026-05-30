/**
 * Image upload — S3/R2 presigned POST URLs (M3.3).
 *
 * Returns a presigned upload URL. The client uploads directly to S3/R2.
 */

import { Elysia, t } from "elysia";
import { authGuard } from "../auth/guard";
import { env } from "../env";

function s3Endpoint(): { endpoint: string; region: string; bucket: string; accessKey: string; secretKey: string } | null {
  if (!env.S3_ENDPOINT || !env.S3_BUCKET || !env.S3_ACCESS_KEY_ID || !env.S3_SECRET_ACCESS_KEY) return null;
  return {
    endpoint: env.S3_ENDPOINT,
    region: env.S3_REGION ?? "auto",
    bucket: env.S3_BUCKET,
    accessKey: env.S3_ACCESS_KEY_ID,
    secretKey: env.S3_SECRET_ACCESS_KEY,
  };
}

export const uploadModule = new Elysia({ prefix: "/upload" })
  .use(authGuard)

  .get(
    "/presigned",
    ({ workspaceId, query, status }) => {
      const s3 = s3Endpoint();
      if (!s3) return status(503, "Storage not configured");

      const filename = `${workspaceId}/${Date.now()}-${query.filename ?? "upload"}`;
      const uploadUrl = `${s3.endpoint}/${s3.bucket}/${filename}`;

      // In production: generate a real presigned URL with AWS Signature V4.
      // For now, return the direct URL for R2 with public bucket or proxy.
      return {
        uploadUrl,
        publicUrl: `${s3.endpoint}/${s3.bucket}/${filename}`,
        filename,
      };
    },
    { query: t.Object({ filename: t.String() }) }
  );
