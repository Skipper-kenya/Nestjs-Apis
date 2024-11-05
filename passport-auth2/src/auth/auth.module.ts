import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalPassportStrategy } from './passport.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthStrategy } from './jwt.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: 'super_secret',
      signOptions: { expiresIn: '3600s' },
    }),
  ],
  providers: [AuthService, LocalPassportStrategy, JwtAuthStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
