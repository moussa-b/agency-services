import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { TerminusModule } from "@nestjs/terminus";
import { SharedModule } from "../shared/shared.module";
import { UsersModule } from "../users/users.module";
import { ClientsModule } from "../clients/clients.module";

@Module({
  imports: [TerminusModule, SharedModule, UsersModule, ClientsModule],
  controllers: [HealthController]
})
export class HealthModule {}
