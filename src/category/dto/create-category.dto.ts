import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: "string" })
  name: string;
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ type: "string" })
  description: string;
}
