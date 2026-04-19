import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { CurrentUser } from 'src/common/decorators';
import { DoctorService } from './doctor.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';

@Controller('doctors')
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  @Get()
  async getAllDoctors(
    @CurrentUser() user: any,
    @Query('limit') limit: string = '20',
    @Query('offset') offset: string = '0',
    @Query('specialization') specialization?: string,
    @Query('availability') availability?: string,
    @Query('sortBy') sortBy: string = 'name',
    @Query('sortOrder') sortOrder: string = 'asc',
  ) {
    return this.doctorService.getAllDoctors(
      user.clinicId,
      parseInt(limit),
      parseInt(offset),
      specialization,
      availability,
      sortBy,
      sortOrder,
    );
  }

  @Get(':doctorId')
  async getDoctorById(
    @CurrentUser() user: any,
    @Param('doctorId') doctorId: string,
  ) {
    return this.doctorService.getDoctorById(user.clinicId, doctorId);
  }

  @Post()
  async createDoctor(
    @CurrentUser() user: any,
    @Body() createDoctorDto: CreateDoctorDto,
  ) {
    return this.doctorService.createDoctor(user.clinicId, createDoctorDto);
  }

  @Put(':doctorId')
  async updateDoctor(
    @CurrentUser() user: any,
    @Param('doctorId') doctorId: string,
    @Body() updateDoctorDto: UpdateDoctorDto,
  ) {
    return this.doctorService.updateDoctor(user.clinicId, doctorId, updateDoctorDto);
  }

  @Delete(':doctorId')
  async deleteDoctor(
    @CurrentUser() user: any,
    @Param('doctorId') doctorId: string,
  ) {
    return this.doctorService.deleteDoctor(user.clinicId, doctorId);
  }
}


