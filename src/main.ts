import { Logger, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.enableCors();

  const config = new DocumentBuilder().setTitle("Qquote API").setDescription("").setVersion("1.0").build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api-docs", app, document);

  await app.listen(process.env.PORT || 3000);
  Logger.log(`${process.env.APP_NAME} is running at ${await app.getUrl()}`);
}
bootstrap();
