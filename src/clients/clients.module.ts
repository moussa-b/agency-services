import { Module } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { ClientsController } from './clients.controller';
import { ClientRepository } from './client.repository';
import { ClientsHealthIndicator } from './clients-health.indicator';
import { ConfigService } from "@nestjs/config";

@Module({
  controllers: [ClientsController],
  providers: [ConfigService, ClientRepository, ClientsService, ClientsHealthIndicator],
  exports: [ClientsHealthIndicator],
})
export class ClientsModule {}
