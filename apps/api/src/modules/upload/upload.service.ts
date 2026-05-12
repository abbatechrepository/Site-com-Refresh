import { Injectable, NotFoundException } from "@nestjs/common";
import { Client } from "minio";
import type { Readable } from "stream";

@Injectable()
export class UploadService {
  private readonly endpoint: URL;
  private readonly bucket: string;
  private readonly accessKey: string;
  private readonly secretKey: string;
  private readonly publicApiUrl: string;

  constructor() {
    const endpoint = process.env.S3_ENDPOINT || "http://minio:9000";

    this.endpoint = new URL(endpoint);
    this.accessKey = process.env.S3_ACCESS_KEY || "minioadmin";
    this.secretKey = process.env.S3_SECRET_KEY || "minioadmin";
    this.bucket = process.env.S3_BUCKET || "uploads";
    this.publicApiUrl = (
      process.env.NEXT_PUBLIC_API_URL ||
      process.env.INTERNAL_API_URL ||
      "http://localhost:3333/api/v1"
    ).replace(/\/$/, "");
  }

  private createClient(endpoint: URL) {
    return new Client({
      endPoint: endpoint.hostname,
      port: Number(endpoint.port) || (endpoint.protocol === "https:" ? 443 : 80),
      useSSL: endpoint.protocol === "https:",
      accessKey: this.accessKey,
      secretKey: this.secretKey,
    });
  }

  private getEndpointCandidates() {
    const candidates = [this.endpoint];

    if (process.env.NODE_ENV !== "production" && this.endpoint.hostname === "minio") {
      candidates.push(
        new URL(`${this.endpoint.protocol}//localhost:${this.endpoint.port || "9000"}`)
      );
    }

    return candidates;
  }

  private shouldTryNextEndpoint(error: unknown) {
    if (process.env.NODE_ENV === "production") {
      return false;
    }

    const code = typeof error === "object" && error && "code" in error
      ? String((error as { code?: unknown }).code)
      : "";

    return ["ENOTFOUND", "EAI_AGAIN", "ECONNREFUSED"].includes(code);
  }

  private async withClient<T>(operation: (client: Client) => Promise<T>) {
    const endpoints = this.getEndpointCandidates();
    let lastError: unknown;

    for (const [index, endpoint] of endpoints.entries()) {
      try {
        return await operation(this.createClient(endpoint));
      } catch (error) {
        lastError = error;

        if (index === endpoints.length - 1 || !this.shouldTryNextEndpoint(error)) {
          break;
        }
      }
    }

    throw lastError;
  }

  private buildPublicMediaUrl(objectName: string) {
    const encodedObjectName = objectName
      .split("/")
      .map((segment) => encodeURIComponent(segment))
      .join("/");

    return `${this.publicApiUrl}/media/${encodedObjectName}`;
  }

  private sanitizePathSegment(value: string) {
    return value.replace(/[^\w.-]/g, "");
  }

  private inferContentType(filename: string) {
    const extension = filename.split(".").pop()?.toLowerCase();

    if (extension === "png") return "image/png";
    if (extension === "webp") return "image/webp";
    if (extension === "gif") return "image/gif";
    if (extension === "svg") return "image/svg+xml";

    return "image/jpeg";
  }

  async saveUserImage(
    file: Express.Multer.File,
    username: string
  ): Promise<string> {
    const safeUsername = username
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]/g, "");

    const ext = file.originalname.split(".").pop();
    const filename = `${Date.now()}.${ext}`;

    const objectName = `users/${safeUsername}/${filename}`;

    await this.withClient(async (client) => {
      const bucketExists = await client.bucketExists(this.bucket);
      if (!bucketExists) {
        await client.makeBucket(this.bucket, "us-east-1");
      }

      await client.putObject(
        this.bucket,
        objectName,
        file.buffer,
        file.size,
        {
          "Content-Type": file.mimetype,
        }
      );
    });

    return this.buildPublicMediaUrl(objectName);
  }

  async getUserImage(username: string, filename: string): Promise<{
    stream: Readable;
    contentType: string;
  }> {
    const safeUsername = this.sanitizePathSegment(username);
    const safeFilename = this.sanitizePathSegment(filename);

    if (!safeUsername || !safeFilename) {
      throw new NotFoundException("Imagem nao encontrada.");
    }

    const objectName = `users/${safeUsername}/${safeFilename}`;

    try {
      return await this.withClient(async (client) => {
        const stat = await client.statObject(this.bucket, objectName);
        const stream = await client.getObject(this.bucket, objectName);
        const metadata = stat.metaData as Record<string, string> | undefined;

        return {
          stream,
          contentType:
            metadata?.["content-type"] ??
            metadata?.["Content-Type"] ??
            this.inferContentType(safeFilename),
        };
      });
    } catch {
      throw new NotFoundException("Imagem nao encontrada.");
    }
  }
}
