import { Injectable } from '@nestjs/common';
import { HealthIndicator, HealthIndicatorResult } from "@nestjs/terminus";
import { SqliteService } from "./sqlite.service";

@Injectable()
export class DbHealthIndicator extends HealthIndicator {

  constructor(private readonly sqliteService: SqliteService) {
    super();
  }

  async isHealthy(): Promise<HealthIndicatorResult> {
    const result: {test: number} = await this.sqliteService.get('SELECT 1 AS test');
    return this.getStatus('db', result?.test === 1);
  }
}
