import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService?.get<string>('JWT_SECRET') || process.env.JWT_SECRET || 'dev-jwt-secret-hackathon-central-change-in-prod-32chars',
    });
  }

  async validate(payload: any) {
    const user = await this.prisma.user.findFirst({ where: { id: payload.sub } });
    if (!user) {
      throw new UnauthorizedException();
    }
    return { id: user.id, email: user.email, role: user.role };
  }
}
