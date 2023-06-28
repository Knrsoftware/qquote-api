import { Transform } from "class-transformer";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class PaginationParamsDto {
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10), { toClassOnly: true })
  limit = 100;

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10), { toClassOnly: true })
  offset = 0;

  @IsOptional()
  @IsString()
  addedBy: string;

  @IsOptional()
  @IsString()
  category: string;

  @IsOptional()
  @IsString()
  tag: string;
}
