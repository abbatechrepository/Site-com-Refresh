import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import cookieParser from "cookie-parser";
import helmet from "helmet";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: false
  });
  const allowedOrigins = (process.env.CORS_ORIGINS ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  const isDevelopment = (process.env.NODE_ENV ?? "development") !== "production";

  app.setGlobalPrefix("api/v1");
  app.use(helmet());
  app.use(cookieParser(process.env.COOKIE_SECRET));
  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      if (isDevelopment) {
        try {
          const { hostname } = new URL(origin);
          if (hostname === "localhost" || hostname === "127.0.0.1") {
            callback(null, true);
            return;
          }
        } catch {
          callback(new Error("Origem invalida."), false);
          return;
        }
      }

      callback(new Error("Origem nao permitida pelo CORS."), false);
    },
    credentials: true
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true
    })
  );

  const port = Number(process.env.API_PORT ?? 3333);
  await app.listen(port, "0.0.0.0");
}

bootstrap();
