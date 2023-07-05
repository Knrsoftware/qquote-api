import { Module } from "@nestjs/common";
import { SharedService } from "./shared.service";
import { ImageService } from "./image.service";

@Module({
  providers: [SharedService, ImageService],
  exports: [SharedService, ImageService],
})
export class SharedModule {}
