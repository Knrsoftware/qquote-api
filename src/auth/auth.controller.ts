import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { SharedService } from 'src/shared/shared.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private sharedService: SharedService,
  ) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.sharedService.successResponse(
      'Registration successful',
      await this.authService.register(createUserDto),
    );
  }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Req() req: any) {
    return this.sharedService.successResponse(
      'Login successful',
      await this.authService.login(req.user),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req: any) {
    return this.sharedService.successResponse('Get profile', req.user);
  }
}
