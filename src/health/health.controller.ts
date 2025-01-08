import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckResult, HealthCheckService } from "@nestjs/terminus";
import { DbHealthIndicator } from '../shared/db/db-health.indicator';
import { UsersHealthIndicator } from '../users/users-health.indicator';
import { ClientsHealthIndicator } from '../clients/clients-health.indicator';
import { MailHealthIndicator } from '../shared/mail/mail-health.indicator';
import { ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags('Health')
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
  @ApiOperation({ summary: 'Perform a health check for the application' })
  healthCheck(): Promise<HealthCheckResult> {
    return this.health.check([
      () => this.dbHealthIndicator.isHealthy(),
      () => this.usersHealthIndicator.isHealthy(),
      () => this.clientsHealthIndicator.isHealthy(),
      () => this.mailHealthIndicator.isHealthy(),
    ]);
  }
}
