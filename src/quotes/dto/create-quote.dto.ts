import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateQuoteDto {
  @IsString()
  @IsNotEmpty()
  title: string;
  @IsString()
  @IsOptional()
  subtitle: string;
  @IsString()
  @IsOptional()
  author: string;
  @IsString()
  @IsOptional()
  reference: string;
  @IsString()
  tags: string;
}
