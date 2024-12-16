import { Module } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { ClientsController } from './clients.controller';
import { ClientRepository } from "./client.repository";

@Module({
  controllers: [ClientsController],
  providers: [ClientRepository, ClientsService],
})
export class ClientsModule {}
