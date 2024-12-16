import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersRepository } from "./users.repository";
import { UsersHealthIndicator } from "./users-health.indicator";

@Module({
  controllers: [UsersController],
  providers: [UsersRepository, UsersService, UsersHealthIndicator],
  exports: [UsersService, UsersHealthIndicator]
})
export class UsersModule {}
