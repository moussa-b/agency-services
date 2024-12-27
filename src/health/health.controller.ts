import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';
import { DbHealthIndicator } from '../shared/db/db-health.indicator';
import { UsersHealthIndicator } from '../users/users-health.indicator';
import { ClientsHealthIndicator } from '../clients/clients-health.indicator';
import { MailHealthIndicator } from '../shared/mail/mail-health.indicator';

@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly dbHealthIndicator: DbHealthIndicator,
    private readonly usersHealthIndicator: UsersHealthIndicator,
    private readonly clientsHealthIndicator: ClientsHealthIndicator,
    private readonly mailHealthIndicator: MailHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  healthCheck() {
    return this.health.check([
      () => this.dbHealthIndicator.isHealthy(),
      () => this.usersHealthIndicator.isHealthy(),
      () => this.clientsHealthIndicator.isHealthy(),
      () => this.mailHealthIndicator.isHealthy(),
    ]);
  }
}
