import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import * as bcrypt from 'bcrypt';
import { JwtService } from "@nestjs/jwt";
import { User } from "../users/entities/user.entity";
import { ActivateUserDto } from "../users/dto/activate-user.dto";
import { ResetPasswordDto } from "../users/dto/reset-password.dto";

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

  async activate(activateUserDto: ActivateUserDto) {
    return {status: await this.usersService.activateUser(activateUserDto)};
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    return {status: await this.usersService.resetPassword(resetPasswordDto)};
  }

  async forgotPassword(email: string) {
    return {status: await this.usersService.forgotPassword(email)};
  }
}
