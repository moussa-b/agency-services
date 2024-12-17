import { Injectable } from '@nestjs/common';
import { HealthIndicator, HealthIndicatorResult } from '@nestjs/terminus';
import { SqliteService } from '../shared/db/sqlite.service';

@Injectable()
export class ClientsHealthIndicator extends HealthIndicator {
  constructor(private readonly sqliteService: SqliteService) {
    super();
  }

  async isHealthy(): Promise<HealthIndicatorResult> {
    const clientTableCount: {count: number} = await this.sqliteService.get(
      'SELECT count(*) as count FROM sqlite_master WHERE type="table" AND name="users"',
    );
    return this.getStatus('clients', clientTableCount?.count === 1, {
      isClientTablePresent: clientTableCount?.count === 1
    });
  }
}
