import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          // Extract the JWT from the cookie named 'jwt'
          const jwt = request?.cookies?.jwtToken || null;

          if (!jwt) {
            throw new UnauthorizedException('no token found');
          }

          return jwt;
        },
      ]),
      secretOrKey: 'super_secret',
      ignoreExpiration: false,
    });
  }

  async validate(payload: any): Promise<any> {
    return { user: payload.username, userId: payload.sub };
  }
}
