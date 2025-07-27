import * as agron2 from 'argon2';
import * as crypto from 'crypto';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { Response } from 'express';

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async logIn(loginDto: LoginDto, res?: Response): Promise<any> {
    const user = await this.usersService.findOneByEmail(loginDto.email);
    if (!user) throw new UnauthorizedException('Wrong Credentials');

    const matchedPassword = await agron2.verify(
      user.password,
      loginDto.password,
    );

    if (!matchedPassword) throw new UnauthorizedException('Wrong Credentials');

    const payload = { email: user.email, sub: user._id, role: user.role };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.generateRefreshToken();
    const refreshTokenHash = await agron2.hash(refreshToken);

    await this.usersService.update(user._id.toString(), { refreshTokenHash });

    if (res) {
      res.cookie('refresh_token', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/auth/refresh-token',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
    }
    return res?.json({ access_token: accessToken });
  }

  async refreshToken(
    req: { cookies: { refresh_token: string } },
    res?: Response,
  ) {
    const refreshToken = req.cookies.refresh_token;
    if (!refreshToken) throw new UnauthorizedException('No refresh token');

    // find user by refresh token hash
    const user = await this.usersService.findOneByRefreshToken(refreshToken);
    if (!user) throw new UnauthorizedException('Invalid refresh token');

    // verify refresh token
    const valid = await agron2.verify(user.refreshTokenHash!, refreshToken);
    if (!valid) throw new UnauthorizedException('Invalid refresh token');

    // issue new access token
    const payload = { email: user.email, sub: user._id, role: user.role };
    const accessToken = this.jwtService.sign(payload);
    return res?.json({ access_token: accessToken });
  }

  async logout(userId: string, res?: Response) {
    await this.usersService.update(userId, { refreshTokenHash: undefined });
    if (res) {
      res.clearCookie('refresh_token', { path: '/auth/refresh-token' });
    }
    return res?.json({ success: true, message: 'Logout successful' });
  }

  async signUp(signUpDto: CreateUserDto): Promise<any> {
    const user = await this.usersService.create(signUpDto);
    return {
      message: 'Signup successful',
      user,
    };
  }

  generateRefreshToken(): string {
    return crypto.randomBytes(64).toString('hex');
  }

  getProfile(user: JwtPayload): JwtPayload {
    return user;
  }
}
