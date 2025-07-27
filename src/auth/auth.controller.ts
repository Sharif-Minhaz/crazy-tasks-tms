import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  UseGuards,
  UsePipes,
  Res,
  Req,
} from '@nestjs/common';
import { AuthService, JwtPayload } from './auth.service';
import { LoginDto, loginSchema } from './dto/login.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { GuestGuard } from '../guards/guest.guard';
import { ZodValidationPipe } from 'src/pipes/zodValidationPipe';
import { CreateUserDto, createUserSchema } from 'src/users/dto/create-user.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(GuestGuard)
  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(
    @Body(new ZodValidationPipe(loginSchema)) signInDto: LoginDto,
    @Res() res: Response,
  ) {
    return this.authService.logIn(signInDto, res);
  }

  @UseGuards(GuestGuard)
  @Post('signup')
  @UsePipes(new ZodValidationPipe(createUserSchema))
  signUp(@Body() signUpDto: CreateUserDto) {
    return this.authService.signUp(signUpDto);
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('logout')
  async logout(@Req() req: { user?: JwtPayload }, @Res() res: Response) {
    const userId = req.user?.userId;
    if (userId) {
      return await this.authService.logout(userId, res);
    }

    return res
      .status(HttpStatus.UNAUTHORIZED)
      .json({ message: 'Logout failed' });
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh-token')
  async refreshToken(@Req() req, @Res() res: Response) {
    return await this.authService.refreshToken(req, res);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req: { user?: JwtPayload }) {
    return this.authService.getProfile(req.user as JwtPayload);
  }
}
