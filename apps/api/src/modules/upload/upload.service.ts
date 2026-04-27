import { Injectable } from "@nestjs/common";
import * as fs from "fs";
import * as path from "path";

@Injectable()
export class UploadService {
  saveUserImage(file: Express.Multer.File, username: string): string {
    const safeUsername = username
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]/g, "");

    const uploadDir = path.join(
      process.cwd(),
      "..",
      "refresh",
      "public",
      "uploads",
      "users",
      safeUsername
    );

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}${ext}`;
    const fullPath = path.join(uploadDir, filename);

    fs.writeFileSync(fullPath, file.buffer);

    return `/uploads/users/${safeUsername}/${filename}`;
  }
}