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

import { InconsistentSnapshotsStateException } from '&app/core/utils/InconsistentSnapshotsStateException';
import { PeriodAmountCalculator } from '&app/core/domain/calculator/PeriodAmountCalculator';
import { CategoryCalculator } from '&app/core/domain/calculator/CategoryCalculator';
import { AverageCalculator } from '&app/core/domain/calculator/AverageCalculator';
import { GrowCalculator } from '&app/core/domain/calculator/GrowCalculator';
import { PeriodCategories } from '&app/core/domain/dto/PeriodCategories';
import { TaskManager } from '&app/core/infrastructure/TaskManager';
import { PeriodAmount } from '&app/core/domain/dto/PeriodAmount';
import { Average } from '&app/core/domain/dto/Average';
import { Grow } from '&app/core/domain/dto/Grow';

import { TransformInterceptor } from './TransformInterceptor';
import { RecalculationFilter } from './RecalculationFilter';
import { CurrencyInterceptor } from './CurrencyInterceptor';
import { EnumValidationPipe } from './EnumValidationPipe';
import { DateRangeParsePipe } from './DateRangeParsePipe';
import { CurrentUser } from './CurrentUser';
import { AuthGuard } from './AuthGuard';

@Controller('v1/statistics')
@UseGuards(AuthGuard)
@UseInterceptors(new TransformInterceptor())
@UseInterceptors(CurrencyInterceptor)
@UseFilters(new RecalculationFilter())
@ApiTags('statistics')
@ApiBearerAuth()
export class StatisticsController {
  constructor(
    private readonly periodAmount: PeriodAmountCalculator,
    private readonly categories: CategoryCalculator,
    private readonly average: AverageCalculator,
    private readonly grow: GrowCalculator,
    private readonly tasks: TaskManager,
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

  @Get('grow')
  @ApiOkResponse({ type: Grow })
  @ApiNoContentResponse({ description: 'Analysis do not ready' })
  @ApiQuery({ name: 'periodType', enum: Object.values(PeriodType) })
  async fetchGrow(
    @CurrentUser() user: TokenPayload,
    @Query('periodType', new EnumValidationPipe(PeriodType))
    periodType: PeriodType,
  ) {
    await this.throwUnlessRecalculation(user.login);

    return this.grow.calculate(user.login, periodType);
  }

  private async throwUnlessRecalculation(userId: string) {
    const skip = await this.tasks.someTaskInProgress(userId);

    if (skip) {
      throw new InconsistentSnapshotsStateException();
    }
  }
}
