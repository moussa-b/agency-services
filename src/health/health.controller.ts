import { Controller, Get } from "@nestjs/common";
import { HealthCheck, HealthCheckService } from "@nestjs/terminus";
import { CoreHealthIndicator } from "../core/core.health-indicator";

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private coreHealthIndicator: CoreHealthIndicator
  ) {}

  @Get()
  @HealthCheck()
  healthCheck() {
    return this.health.check([
      () => this.coreHealthIndicator.isHealthy(),
    ])
  }
}
