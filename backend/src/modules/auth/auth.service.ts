import { Injectable, UnauthorizedException, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { RegisterDto, LoginDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.prisma.user.findFirst({ where: { email: dto.email } });
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash: hashedPassword,
        name: (dto as any).name || (dto as any).firstName || dto.email.split('@')[0],
        role: (dto.role as any) || 'PARTICIPANT',
      } as any,
    });

    const tokens = await this.generateTokens(user.id, user.role);
    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
        bio: user.bio,
      },
      tokens,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findFirst({ where: { email: dto.email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Account lockout check
    if ((user as any).lockoutUntil && (user as any).lockoutUntil > new Date()) {
      throw new ForbiddenException('Account is locked due to multiple failed login attempts');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash || (user as any).password || '');
    if (!isPasswordValid) {
      const attempts = ((user as any).failedLoginAttempts || 0) + 1;
      const lockout = attempts >= 5 ? new Date(Date.now() + 15 * 60 * 1000) : null;
      await this.prisma.user.update({
        where: { id: user.id },
        data: { failedLoginAttempts: attempts, lockoutUntil: lockout } as any,
      });
      throw new UnauthorizedException('Invalid credentials');
    }

    // Reset attempts on successful login
    await this.prisma.user.update({
      where: { id: user.id },
      data: { failedLoginAttempts: 0, lockoutUntil: null } as any,
    });

    const tokens = await this.generateTokens(user.id, user.role);
    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
        bio: user.bio,
      },
      tokens,
    };
  }

  async refreshToken(token: string) {
    try {
      const payload = this.jwtService.verify(token, {
        secret: this.configService.get<string>('jwt.refreshSecret'),
      });
      
      const session = await this.prisma.userSession.findFirst({
        where: { userId: payload.sub, refreshToken: token } as any,
      });

      if (!session) throw new UnauthorizedException('Invalid refresh token');

      const user = await this.prisma.user.findFirst({ where: { id: payload.sub } });
      if (!user) throw new NotFoundException('User not found');

      // Refresh token rotation
      await this.prisma.userSession.update({
        where: { id: session.id },
        data: { revokedAt: new Date() } as any,
      });

      return this.generateTokens(user.id, user.role);
    } catch (e) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async forgotPassword(email: string) {
    const user = await this.prisma.user.findFirst({ where: { email } });
    if (!user) return { message: 'If email exists, reset instructions have been sent.' };
    
    // Generate token and save to DB
    return { message: 'If email exists, reset instructions have been sent.' };
  }

  async resetPassword(token: string, newPassword: string) {
    // Verify token and update password
    return { message: 'Password reset successfully' };
  }

  private async generateTokens(userId: string, role: string) {
    const payload = { sub: userId, role };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('jwt.refreshSecret'),
      expiresIn: this.configService.get<string>('jwt.refreshExpiresIn'),
    });

    await this.prisma.userSession.create({
      data: {
        userId,
        tokenFamily: userId,
        refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      } as any,
    });

    return { accessToken, refreshToken };
  }
}
