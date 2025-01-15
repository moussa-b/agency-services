import { Injectable } from '@nestjs/common';
import { HealthIndicator, HealthIndicatorResult } from '@nestjs/terminus';
import { DatabaseService } from '../shared/db/database-service';
import { ConfigService } from "@nestjs/config";

@Injectable()
export class CalendarEventsHealthIndicator extends HealthIndicator {
  constructor(private readonly databaseService: DatabaseService,
              private readonly configService: ConfigService,) {
    super();
  }

  async isHealthy(): Promise<HealthIndicatorResult> {
    let calendarEventTableCount = {count: 0};
    if (this.configService.get<string>('DATABASE_URL')?.length > 0) {
      if (this.configService.get<string>('DATABASE_URL').includes('mysql')) {
        calendarEventTableCount = await this.databaseService.get(
          'SELECT COUNT(*) AS count FROM information_schema.tables WHERE table_schema = (SELECT DATABASE() AS databaseName) AND table_name = "calendar_events";',
        );
      }
    } else { //sqlite
      calendarEventTableCount = await this.databaseService.get(
        'SELECT count(*) as count FROM sqlite_master WHERE type="table" AND name="calendar_events"',
      );
    }
    return this.getStatus('calendarEvents', calendarEventTableCount?.count === 1, {
      isCalendarEventTablePresent: calendarEventTableCount?.count === 1,
    });
  }
}
