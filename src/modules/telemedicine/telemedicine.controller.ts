import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { CurrentUser } from 'src/common/decorators';
import { TelemedicineService } from './telemedicine.service';
import { CreateTelemedicineConsultationDto } from './dto/create-consultation.dto';

@Controller('telemedicine/consultations')
export class TelemedicineController {
  constructor(private readonly telemedicineService: TelemedicineService) {}

  @Get()
  async getConsultations(
    @CurrentUser() user: any,
    @Query('limit') limit: string = '20',
    @Query('offset') offset: string = '0',
    @Query('status') status?: string,
    @Query('patientId') patientId?: string,
    @Query('doctorId') doctorId?: string,
  ) {
    return this.telemedicineService.getConsultations(
      user.clinicId,
      parseInt(limit),
      parseInt(offset),
      status,
      patientId,
      doctorId,
    );
  }

  @Post()
  async createConsultation(
    @CurrentUser() user: any,
    @Body() createConsultationDto: CreateTelemedicineConsultationDto,
  ) {
    return this.telemedicineService.createConsultation(
      user.clinicId,
      createConsultationDto,
      user.id,
    );
  }

  @Post(':consultationId/start')
  async startConsultation(
    @CurrentUser() user: any,
    @Param('consultationId') consultationId: string,
  ) {
    return this.telemedicineService.startConsultation(user.clinicId, consultationId);
  }
}
