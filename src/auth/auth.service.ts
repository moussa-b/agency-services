import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import * as bcrypt from 'bcrypt';
import { JwtService } from "@nestjs/jwt";
import { User } from "../users/entities/user.entity";

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService,
              private jwtService: JwtService) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmailOrUsername(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      if (!user.isActive) {
        throw new UnauthorizedException('Please verify your email first');
      }
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: User) {
    const payload = { username: user.username, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
