import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateQuoteDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: "string" })
  title: string;
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ type: "string" })
  subtitle: string;
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ type: "string" })
  author: string;
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ type: "string" })
  reference: string;
  @IsString()
  @ApiProperty({ type: "string" })
  category: string;
  @IsArray()
  @ApiProperty({ type: Array })
  tags: string[];
}
