/**
 * AuthService: Handles authentication logic using Prisma and bcrypt.
 * Uses DI for PrismaService and JwtService.
 */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  /**
   * Authenticate user using Prisma and bcrypt.
   * Returns { accessToken, user }
   */
  async login(email: string, password: string) {
    // Lookup user by email
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid credentials');
    }
    // Compare password hash
    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid credentials');
    }
    // JWT payload
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
    const accessToken = this.jwtService.sign(payload);
    // Return safe user object (exclude password)
    const safeUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
    return {
      accessToken,
      user: safeUser,
    };
  }
}
