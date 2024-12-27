import { Injectable } from '@nestjs/common';
import { HealthIndicator, HealthIndicatorResult } from '@nestjs/terminus';
import { DatabaseService } from './database-service';

@Injectable()
export class DbHealthIndicator extends HealthIndicator {
  constructor(private readonly databaseService: DatabaseService) {
    super();
  }

  async isHealthy(): Promise<HealthIndicatorResult> {
    const result: { test: number } =
      await this.databaseService.get('SELECT 1 AS test');
    return this.getStatus('db', result?.test === 1);
  }
}
