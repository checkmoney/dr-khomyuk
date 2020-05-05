import { PeriodType, DateRange, TokenPayload } from '@checkmoney/soap-opera';
import {
  Controller,
  Get,
  UseGuards,
  Query,
  UseInterceptors,
  UseFilters,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiQuery,
  ApiOkResponse,
  ApiNoContentResponse,
} from '@nestjs/swagger';

import { PeriodAmountCalculator } from '&app/core/domain/calculator/PeriodAmountCalculator';
import { CategoryCalculator } from '&app/core/domain/calculator/CategoryCalculator';
import { AverageCalculator } from '&app/core/domain/calculator/AverageCalculator';
import { ProgressManager } from '&app/core/infrastructure/ProgressManager';
import { PeriodCategories } from '&app/core/domain/dto/PeriodCategories';
import { PeriodAmount } from '&app/core/domain/dto/PeriodAmount';
import { Average } from '&app/core/domain/dto/Average';

import { RecalculationInProgressException } from './RecalculationInProgressException';
import { TransformInterceptor } from './TransformInterceptor';
import { EnumValidationPipe } from './EnumValidationPipe';
import { DateRangeParsePipe } from './DateRangeParsePipe';
import { CurrentUser } from './CurrentUser';
import { AuthGuard } from './AuthGuard';
import { RecalculationFilter } from './RecalculationFilter';

@Controller('v1/statistics')
@UseGuards(AuthGuard)
@UseInterceptors(new TransformInterceptor())
@UseFilters(new RecalculationFilter())
@ApiTags('statistics')
@ApiBearerAuth()
export class StatisticsController {
  constructor(
    private readonly average: AverageCalculator,
    private readonly periodAmount: PeriodAmountCalculator,
    private readonly categories: CategoryCalculator,
    private readonly progress: ProgressManager,
  ) {}

  @Get('average')
  @ApiOkResponse({ type: Average })
  @ApiNoContentResponse({ description: 'Analysis do not ready' })
  @ApiQuery({ name: 'periodType', enum: Object.values(PeriodType) })
  async fetchAverage(
    @CurrentUser() user: TokenPayload,
    @Query('periodType', new EnumValidationPipe(PeriodType))
    periodType: PeriodType,
  ) {
    await this.throwUnlessRecalculation(user.login);

    return this.average.calculate(user.login, periodType);
  }

  @Get('periods')
  @ApiOkResponse({ type: PeriodAmount, isArray: true })
  @ApiNoContentResponse({ description: 'Analysis do not ready' })
  @ApiQuery({ name: 'start', type: String })
  @ApiQuery({ name: 'end', type: String })
  @ApiQuery({ name: 'periodType', enum: Object.values(PeriodType) })
  async fetchPeriods(
    @CurrentUser() user: TokenPayload,
    @Query(new DateRangeParsePipe()) range: DateRange,
    @Query('periodType', new EnumValidationPipe(PeriodType))
    periodType: PeriodType,
  ) {
    await this.throwUnlessRecalculation(user.login);

    return this.periodAmount.calculate(user.login, range, periodType);
  }

  @Get('categories')
  @ApiOkResponse({ type: PeriodCategories, isArray: true })
  @ApiNoContentResponse({ description: 'Analysis do not ready' })
  @ApiQuery({ name: 'start', type: String })
  @ApiQuery({ name: 'end', type: String })
  @ApiQuery({ name: 'periodType', enum: Object.values(PeriodType) })
  async fetchCategories(
    @CurrentUser() user: TokenPayload,
    @Query(new DateRangeParsePipe()) range: DateRange,
    @Query('periodType', new EnumValidationPipe(PeriodType))
    periodType: PeriodType,
  ) {
    await this.throwUnlessRecalculation(user.login);

    return this.categories.calculate(user.login, range, periodType);
  }

  private async throwUnlessRecalculation(userId: string) {
    const skip = await this.progress.inProgress(userId);

    if (skip) {
      throw new RecalculationInProgressException();
    }
  }
}
