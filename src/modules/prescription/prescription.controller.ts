import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { CurrentUser } from 'src/common/decorators';
import { PrescriptionService } from './prescription.service';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';

@Controller('prescriptions')
export class PrescriptionController {
  constructor(private readonly prescriptionService: PrescriptionService) {}

  @Post()
  async createPrescription(
    @CurrentUser() user: any,
    @Body() createPrescriptionDto: CreatePrescriptionDto,
  ) {
    return this.prescriptionService.createPrescription(
      user.clinicId,
      createPrescriptionDto,
      user.id,
    );
  }

  @Get(':prescriptionId')
  async getPrescriptionById(
    @CurrentUser() user: any,
    @Param('prescriptionId') prescriptionId: string,
  ) {
    return this.prescriptionService.getPrescriptionById(
      user.clinicId,
      prescriptionId,
    );
  }

  @Get('patient/:patientId')
  async getPrescriptionsByPatient(
    @CurrentUser() user: any,
    @Param('patientId') patientId: string,
    @Query('limit') limit: string = '20',
    @Query('offset') offset: string = '0',
  ) {
    return this.prescriptionService.getPrescriptionsByPatient(
      user.clinicId,
      patientId,
      parseInt(limit),
      parseInt(offset),
    );
  }
}
