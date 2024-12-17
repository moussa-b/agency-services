import { Injectable } from '@nestjs/common';
import { HealthIndicator, HealthIndicatorResult } from '@nestjs/terminus';
import { SqliteService } from '../shared/db/sqlite.service';

@Injectable()
export class UsersHealthIndicator extends HealthIndicator {
  constructor(private readonly sqliteService: SqliteService) {
    super();
  }

  async isHealthy(): Promise<HealthIndicatorResult> {
    const userTableCount: {count: number} = await this.sqliteService.get(
      'SELECT count(*) as count FROM sqlite_master WHERE type="table" AND name="users"',
    );
    const adminUserCount: {count: number} = await this.sqliteService.get(
      'SELECT count(*) as count FROM users WHERE username = "admin"',
    );
    const isHealthy = userTableCount?.count === 1 && adminUserCount?.count === 1;
    return this.getStatus('users', isHealthy, {
      isUsersTablePresent: userTableCount?.count === 1,
      isAdminUserPresent: adminUserCount?.count === 1,
    });
  }
}
