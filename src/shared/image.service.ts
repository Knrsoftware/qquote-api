import { Injectable } from "@nestjs/common";
import * as fs from "fs";

@Injectable()
export class ImageService {
  saveImage(base64String: string, filePath: string) {
    const base64Data = base64String.split(",")[1];
    const buffer = Buffer.from(base64Data, "base64");

    fs.writeFileSync(filePath, buffer);
  }
}
