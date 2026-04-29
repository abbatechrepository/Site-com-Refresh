import { Injectable } from "@nestjs/common";
import { Client } from "minio";

@Injectable()
export class UploadService {
  private minioClient: Client;
  private bucket: string;
  private publicUrl: string;

  constructor() {
    const endpoint = process.env.S3_ENDPOINT || "http://minio:9000";

    const url = new URL(endpoint);

    this.minioClient = new Client({
      endPoint: url.hostname,
      port: Number(url.port) || 9000,
      useSSL: url.protocol === "https:",
      accessKey: process.env.S3_ACCESS_KEY || "minioadmin",
      secretKey: process.env.S3_SECRET_KEY || "minioadmin",
    });

    this.bucket = process.env.S3_BUCKET || "uploads";

    this.publicUrl = (
      process.env.S3_PUBLIC_URL || "http://localhost:9000"
    ).replace(/\/$/, "");
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

    const bucketExists = await this.minioClient.bucketExists(this.bucket);
    if (!bucketExists) {
      await this.minioClient.makeBucket(this.bucket, "us-east-1");
    }

    await this.minioClient.setBucketPolicy(this.bucket, JSON.stringify({
      Version: "2012-10-17",
      Statement: [
      {
        Effect: "Allow",
        Principal: { AWS: ["*"] },
        Action: ["s3:GetObject"],
        Resource: [`arn:aws:s3:::${this.bucket}/*`],
      },
      ],
    }));

    await this.minioClient.putObject(
      this.bucket,
      objectName,
      file.buffer,
      file.size,
      {
        "Content-Type": file.mimetype,
      }
    );

    return `${this.publicUrl}/${this.bucket}/${objectName}`;
  }
}