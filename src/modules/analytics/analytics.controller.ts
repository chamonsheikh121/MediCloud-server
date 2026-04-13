import {
  Controller,
  Get,
  Query,
} from '@nestjs/common';
import { CurrentUser } from 'src/common/decorators';
import { AnalyticsService } from './analytics.service';

@Controller()
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('analytics/dashboard')
  async getDashboardAnalytics(
    @CurrentUser() user: any,
    @Query('period') period: string = 'month',
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
  ) {
    return this.analyticsService.getDashboardAnalytics(
      user.clinicId,
      period,
      dateFrom,
      dateTo,
    );
  }

  @Get('clinic/info')
  async getClinicInfo(@CurrentUser() user: any) {
    return this.analyticsService.getClinicInfo(user.clinicId);
  }

  @Get('clinic/statistics')
  async getClinicStatistics(@CurrentUser() user: any) {
    return this.analyticsService.getClinicStatistics(user.clinicId);
  }
}
