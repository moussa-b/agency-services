import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { ActivateUserDto } from '../users/dto/activate-user.dto';
import { ResetPasswordDto } from '../users/dto/reset-password.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { UserRole } from '../users/entities/user-role.enum';
import { UpdateUserDto } from '../users/dto/update-user.dto';
import { UpdateUserSecurityDto } from '../users/dto/update-user-security.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(200)
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('activate')
  @HttpCode(200)
  async activate(@Body() activateUserDto: ActivateUserDto) {
    return this.authService.activate(activateUserDto);
  }

  @Post('password/forgot')
  async forgotPassword(@Body('email') email: string) {
    return this.authService.forgotPassword(email);
  }

  @Post('password/reset')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async profile(
    @CurrentUser() user: { id: number; role?: UserRole; username?: string },
  ) {
    return this.authService.getProfile(user.id);
  }

  @Post('profile')
  @UseGuards(JwtAuthGuard)
  async updateProfile(
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() user: { id: number; role?: UserRole; username?: string },
  ) {
    return this.authService.updateProfile(user.id, updateUserDto);
  }

  @Post('profile/security')
  @UseGuards(JwtAuthGuard)
  async updateProfileSecurity(
    @Body() updateUserSecurityDto: UpdateUserSecurityDto,
    @CurrentUser() user: { id: number; role?: UserRole; username?: string },
  ) {
    return this.authService.updateProfileSecurity(
      user.id,
      updateUserSecurityDto,
    );
  }
}
