import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import { ActivateUserDto } from '../users/dto/activate-user.dto';
import { ResetPasswordDto } from '../users/dto/reset-password.dto';
import { UpdateUserDto } from '../users/dto/update-user.dto';
import { UpdateUserSecurityDto } from '../users/dto/update-user-security.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}

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

  login(user: User) {
    const payload = { username: user.username, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async activate(activateUserDto: ActivateUserDto) {
    return { status: await this.usersService.activateUser(activateUserDto) };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    return { status: await this.usersService.resetPassword(resetPasswordDto) };
  }

  async forgotPassword(email: string) {
    return { status: await this.usersService.forgotPassword(email) };
  }

  getProfile(userId: number) {
    return this.usersService.findOne(userId, false, true);
  }

  updateProfile(userId: number, updateUserDto: UpdateUserDto) {
    delete updateUserDto.password;
    delete updateUserDto.role;
    delete updateUserDto.username;
    return this.usersService.update(userId, updateUserDto);
  }

  async updateProfileSecurity(
    userId: number,
    updateUserSecurityDto: UpdateUserSecurityDto,
  ) {
    if (
      updateUserSecurityDto.newPassword !==
      updateUserSecurityDto.confirmPassword
    ) {
      throw new BadRequestException(`Passwords don't match`);
    }
    const user = await this.usersService.findOne(userId, true, false);
    if (!user) {
      throw new NotFoundException(`User with ID ${user} not found`);
    }
    if (
      !(await bcrypt.compare(
        updateUserSecurityDto.currentPassword,
        user.password,
      ))
    ) {
      throw new BadRequestException(`Password is invalid`);
    }
    return {
      status: await this.usersService.updateProfileSecurity(
        userId,
        updateUserSecurityDto,
      ),
    };
  }
}
