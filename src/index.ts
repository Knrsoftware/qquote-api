import { NestFactory } from "@nestjs/core";
import { ExpressAdapter } from "@nestjs/platform-express";
import { AppModule } from "./app.module";
import * as express from "express";
import * as functions from "firebase-functions";
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

const server = express();

export const createNestServer = async expressInstance => {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(expressInstance));
  app.use(express.json({ limit: "10mb" }));
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.enableCors();

  const config = new DocumentBuilder().setTitle("Qquote API").setDescription("").setVersion("1.0").build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api-docs", app, document);
  return app.init();
};

createNestServer(server)
  .then(() => console.log("Nest Ready"))
  .catch(err => console.error("Nest broken", err));

export const api = functions.https.onRequest(server);
