import { IsEmail, IsOptional, IsPhoneNumber, IsString } from "class-validator";

export class CreateUserDto {
  @IsString()
  @IsOptional()
  name: string;
  @IsString()
  username: string;
  @IsString()
  password: string;
  @IsEmail()
  @IsOptional()
  email: string;
  @IsPhoneNumber()
  @IsOptional()
  phoneNumber: string;
}
