import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateTagsDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: "string" })
  value: string;
}
