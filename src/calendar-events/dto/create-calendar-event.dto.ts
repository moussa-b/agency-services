import { CalendarEventStatus } from '../entities/calendar-event-status.enum';
import { ApiProperty } from '@nestjs/swagger';
import { RepetitionOptions } from './repetition-option';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';

export class CreateCalendarEventDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  description?: string;

  @IsDate()
  @IsNotEmpty()
  startDate: Date;

  @IsDate()
  @IsNotEmpty()
  endDate: Date;

  @ApiProperty({
    enum: [
      'WAITING_FOR_CONFIRMATION',
      'CONFIRMED',
      'FINISHED',
      'CANCELLED',
      'MISSED',
    ],
  })
  status?: CalendarEventStatus;

  reminder?: number;

  recurring?: boolean;

  recurringOptions?: RepetitionOptions;

  createdBy?: number;

  updatedBy?: number;
}
