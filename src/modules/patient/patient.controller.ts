import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from 'src/common/decorators';
import { PatientService } from './patient.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';

@Controller('patients')
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @Get()
  async getAllPatients(
    @CurrentUser() user: any,
    @Query('limit') limit: string = '20',
    @Query('offset') offset: string = '0',
    @Query('status') status?: string,
    @Query('search') search?: string,
    @Query('sortBy') sortBy: string = 'name',
    @Query('sortOrder') sortOrder: string = 'asc',
  ) {
    return this.patientService.getAllPatients(
      user.clinicId,
      parseInt(limit),
      parseInt(offset),
      status,
      search,
      sortBy,
      sortOrder,
    );
  }

  @Get(':patientId')
  async getPatientById(
    @CurrentUser() user: any,
    @Param('patientId') patientId: string,
  ) {
    return this.patientService.getPatientById(user.clinicId, patientId);
  }

  @Post()
  async createPatient(
    @CurrentUser() user: any,
    @Body() createPatientDto: CreatePatientDto,
  ) {
    return this.patientService.createPatient(user.clinicId, createPatientDto);
  }

  @Put(':patientId')
  async updatePatient(
    @CurrentUser() user: any,
    @Param('patientId') patientId: string,
    @Body() updatePatientDto: UpdatePatientDto,
  ) {
    return this.patientService.updatePatient(
      user.clinicId,
      patientId,
      updatePatientDto,
    );
  }

  @Delete(':patientId')
  async deletePatient(
    @CurrentUser() user: any,
    @Param('patientId') patientId: string,
  ) {
    return this.patientService.deletePatient(user.clinicId, patientId);
  }
}
