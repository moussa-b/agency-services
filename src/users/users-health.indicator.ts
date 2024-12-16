import { Injectable } from '@nestjs/common';
import { HealthIndicator, HealthIndicatorResult } from '@nestjs/terminus';
import { SqliteService } from '../shared/db/sqlite.service';

@Injectable()
export class UsersHealthIndicator extends HealthIndicator {
  constructor(private readonly sqliteService: SqliteService) {
    super();
  }

  async isHealthy(): Promise<HealthIndicatorResult> {
    const isUsersTablePresent: boolean =
      (await this.sqliteService.get(
        'SELECT count(*) FROM sqlite_master WHERE type="table" AND name="users"',
      )) === 1;
    const isAdminUserPresent: boolean =
      (await this.sqliteService.get(
        'SELECT count(*) FROM users WHERE username = "admin"',
      )) === 1;
    const isHealthy = isUsersTablePresent && isAdminUserPresent;
    return this.getStatus('users', isHealthy, {
      isUsersTablePresent: isUsersTablePresent,
      isAdminUserPresent: isAdminUserPresent,
    });
  }
}
