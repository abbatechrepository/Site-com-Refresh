import { Controller, Get, Param, Res, StreamableFile } from "@nestjs/common";
import type { Response } from "express";
import { UploadService } from "./upload.service";

@Controller("media")
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Get("users/:username/:filename")
  async getUserImage(
    @Param("username") username: string,
    @Param("filename") filename: string,
    @Res({ passthrough: true }) response: Response
  ) {
    const image = await this.uploadService.getUserImage(username, filename);

    response.setHeader("Content-Type", image.contentType);
    response.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    response.setHeader("Cross-Origin-Resource-Policy", "cross-origin");

    return new StreamableFile(image.stream);
  }
}
