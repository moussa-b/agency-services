import { Injectable } from '@nestjs/common';
import { HealthIndicator, HealthIndicatorResult } from "@nestjs/terminus";

@Injectable()
export class CoreHealthIndicator extends HealthIndicator {
  async isHealthy(): Promise<HealthIndicatorResult> {
    const result = this.getStatus('core', true)
    return result;
  }
}
