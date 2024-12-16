import { Controller, Get } from "@nestjs/common";
import { HealthCheck, HealthCheckService } from "@nestjs/terminus";
import { DbHealthIndicator } from "../shared/db/db-health.indicator";
import { UsersHealthIndicator } from "../users/users-health.indicator";
import { ClientsHealthIndicator } from "../clients/clients-health.indicator";

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private dbHealthIndicator: DbHealthIndicator,
    private usersHealthIndicator: UsersHealthIndicator,
    private clientsHealthIndicator: ClientsHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  healthCheck() {
    return this.health.check([
      () => this.dbHealthIndicator.isHealthy(),
      () => this.usersHealthIndicator.isHealthy(),
      () => this.clientsHealthIndicator.isHealthy(),
    ])
  }
}
