import "reflect-metadata";
import "dotenv/config";
import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.enableCors({
    origin: allowedFrontendOrigins(),
    credentials: true
  });
  app.setGlobalPrefix("api/v1");
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true
    })
  );

  const config = new DocumentBuilder()
    .setTitle("Skolaroid API")
    .setDescription("School Management and Learning System API")
    .setVersion("0.1.0")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/docs", app, document);

  const port = Number(process.env.PORT ?? 3000);
  await app.listen(port, "0.0.0.0");
}

void bootstrap();

function allowedFrontendOrigins(): string[] {
  const configured = process.env.FRONTEND_ORIGINS ?? process.env.FRONTEND_ORIGIN;
  if (configured) {
    return configured.split(",").map((origin) => origin.trim()).filter(Boolean);
  }

  return ["http://127.0.0.1:5173", "http://localhost:5173"];
}
