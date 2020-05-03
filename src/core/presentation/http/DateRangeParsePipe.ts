import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

import { DateRange } from '@checkmoney/soap-opera';

@Injectable()
export class DateRangeParsePipe implements PipeTransform<object, DateRange> {
  public transform(value: any, metadata: ArgumentMetadata): DateRange {
    if (!this.supports(metadata)) {
      throw new Error('Unexpected usage of ParseDateRangePipe');
    }

    const start = this.parseDate(value.start);
    const end = this.parseDate(value.end);

    return new DateRange(start, end);
  }

  private supports(metadata: ArgumentMetadata) {
    return metadata.type === 'query' && metadata.metatype === DateRange;
  }

  private parseDate(value: string): Date {
    const date = new Date(value);

    if (!this.dateIsValid(date)) {
      throw new BadRequestException('Invalid date-string');
    }

    return date;
  }

  private dateIsValid(date: Date): boolean {
    return !isNaN(date.getTime());
  }
}
