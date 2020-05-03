import { PeriodType, DateRange, TokenPayload } from '@checkmoney/soap-opera';
import {
  Controller,
  Get,
  UseGuards,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiQuery,
  ApiOkResponse,
} from '@nestjs/swagger';

import { AverageCalculator } from '&app/core/domain/calculator/AverageCalculator';
import { PeriodAmountCalculator } from '&app/core/domain/calculator/PeriodAmountCalculator';
import { CategoryCalculator } from '&app/core/domain/calculator/CategoryCalculator';
import { PeriodCategories } from '&app/core/domain/dto/PeriodCategories';
import { PeriodAmount } from '&app/core/domain/dto/PeriodAmount';
import { Average } from '&app/core/domain/dto/Average';

import { AuthGuard } from './AuthGuard';
import { CurrentUser } from './CurrentUser';
import { EnumValidationPipe } from './EnumValidationPipe';
import { DateRangeParsePipe } from './DateRangeParsePipe';
import { TransformInterceptor } from './TransformInterceptor';

@Controller('v1/statistics')
@UseGuards(AuthGuard)
@UseInterceptors(new TransformInterceptor())
@ApiTags('statistics')
@ApiBearerAuth()
export class StatisticsController {
  constructor(
    private readonly average: AverageCalculator,
    private readonly periodAmount: PeriodAmountCalculator,
    private readonly categories: CategoryCalculator,
  ) {}

  @Get('average')
  @ApiOkResponse({ type: Average })
  @ApiQuery({ name: 'periodType', enum: Object.values(PeriodType) })
  async fetchAverage(
    @CurrentUser() user: TokenPayload,
    @Query('periodType', new EnumValidationPipe(PeriodType))
    periodType: PeriodType,
  ) {
    return this.average.calculate(user.login, periodType);
  }

  @Get('periods')
  @ApiOkResponse({ type: PeriodAmount, isArray: true })
  @ApiQuery({ name: 'start', type: String })
  @ApiQuery({ name: 'end', type: String })
  @ApiQuery({ name: 'periodType', enum: Object.values(PeriodType) })
  async fetchPeriods(
    @CurrentUser() user: TokenPayload,
    @Query(new DateRangeParsePipe()) range: DateRange,
    @Query('periodType', new EnumValidationPipe(PeriodType))
    periodType: PeriodType,
  ) {
    return this.periodAmount.calculate(user.login, range, periodType);
  }

  @Get('categories')
  @ApiOkResponse({ type: PeriodCategories, isArray: true })
  @ApiQuery({ name: 'start', type: String })
  @ApiQuery({ name: 'end', type: String })
  @ApiQuery({ name: 'periodType', enum: Object.values(PeriodType) })
  async fetchCategories(
    @CurrentUser() user: TokenPayload,
    @Query(new DateRangeParsePipe()) range: DateRange,
    @Query('periodType', new EnumValidationPipe(PeriodType))
    periodType: PeriodType,
  ) {
    return this.categories.calculate(user.login, range, periodType);
  }
}
