import { Injectable } from '@nestjs/common';
import { HealthIndicator, HealthIndicatorResult } from '@nestjs/terminus';
import { DatabaseService } from '../shared/db/database-service';
import { ConfigService } from "@nestjs/config";

@Injectable()
export class ClientsHealthIndicator extends HealthIndicator {
  constructor(private readonly databaseService: DatabaseService,
              private readonly configService: ConfigService,) {
    super();
  }

  async isHealthy(): Promise<HealthIndicatorResult> {
    let clientTableCount = {count: 0};
    if (this.configService.get<string>('DATABASE_URL')?.length > 0) {
      if (this.configService.get<string>('DATABASE_URL').includes('mysql')) {
        clientTableCount = await this.databaseService.get(
          'SELECT COUNT(*) AS count FROM information_schema.tables WHERE table_schema = (SELECT DATABASE() AS databaseName) AND table_name = "clients";',
        );
      }
    } else { //sqlite
      clientTableCount = await this.databaseService.get(
        'SELECT count(*) as count FROM sqlite_master WHERE type="table" AND name="users"',
      );
    }
    return this.getStatus('clients', clientTableCount?.count === 1, {
      isClientTablePresent: clientTableCount?.count === 1,
    });
  }
}
