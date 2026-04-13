import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { CurrentUser } from 'src/common/decorators';
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { CancelAppointmentDto } from './dto/cancel-appointment.dto';

@Controller('appointments')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Get()
  async getAllAppointments(
    @CurrentUser() user: any,
    @Query('limit') limit: string = '20',
    @Query('offset') offset: string = '0',
    @Query('patientId') patientId?: string,
    @Query('doctorId') doctorId?: string,
    @Query('status') status?: string,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
    @Query('sortBy') sortBy: string = 'date',
    @Query('sortOrder') sortOrder: string = 'asc',
  ) {
    return this.appointmentService.getAllAppointments(
      user.clinicId,
      parseInt(limit),
      parseInt(offset),
      patientId,
      doctorId,
      status,
      dateFrom,
      dateTo,
      sortBy,
      sortOrder,
    );
  }

  @Get(':appointmentId')
  async getAppointmentById(
    @CurrentUser() user: any,
    @Param('appointmentId') appointmentId: string,
  ) {
    return this.appointmentService.getAppointmentById(user.clinicId, appointmentId);
  }

  @Post()
  async createAppointment(
    @CurrentUser() user: any,
    @Body() createAppointmentDto: CreateAppointmentDto,
  ) {
    return this.appointmentService.createAppointment(
      user.clinicId,
      createAppointmentDto,
      user.id,
    );
  }

  @Put(':appointmentId')
  async updateAppointment(
    @CurrentUser() user: any,
    @Param('appointmentId') appointmentId: string,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
  ) {
    return this.appointmentService.updateAppointment(
      user.clinicId,
      appointmentId,
      updateAppointmentDto,
    );
  }

  @Post(':appointmentId/cancel')
  async cancelAppointment(
    @CurrentUser() user: any,
    @Param('appointmentId') appointmentId: string,
    @Body() cancelAppointmentDto: CancelAppointmentDto,
  ) {
    return this.appointmentService.cancelAppointment(
      user.clinicId,
      appointmentId,
      cancelAppointmentDto.reason,
    );
  }
}
