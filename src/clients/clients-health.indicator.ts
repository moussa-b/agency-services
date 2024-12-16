import { Injectable } from '@nestjs/common';
import { HealthIndicator, HealthIndicatorResult } from '@nestjs/terminus';
import { SqliteService } from '../shared/db/sqlite.service';

@Injectable()
export class ClientsHealthIndicator extends HealthIndicator {
  constructor(private readonly sqliteService: SqliteService) {
    super();
  }

  async isHealthy(): Promise<HealthIndicatorResult> {
    const isClientsTablePresent: boolean =
      (await this.sqliteService.get(
        'SELECT count(*) FROM sqlite_master WHERE type="table" AND name="users"',
      )) === 1;
    return this.getStatus('clients', isClientsTablePresent);
  }
}
