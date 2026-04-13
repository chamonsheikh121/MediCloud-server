import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';

@Injectable()
export class PatientService {
  constructor(private prisma: PrismaService) {}

  async getAllPatients(
    clinicId: string,
    limit: number = 20,
    offset: number = 0,
    status?: string,
    search?: string,
    sortBy: string = 'name',
    sortOrder: string = 'asc',
  ) {
    const where: any = { clinicId };

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { id: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [patients, total] = await Promise.all([
      this.prisma.client.patient.findMany({
        where,
        take: limit,
        skip: offset,
        orderBy: { [sortBy]: sortOrder },
      }),
      this.prisma.client.patient.count({ where }),
    ]);

    return {
      success: true,
      data: patients,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    };
  }

  async getPatientById(clinicId: string, patientId: string) {
    const patient = await this.prisma.client.patient.findFirst({
      where: { id: patientId, clinicId },
    });

    if (!patient) {
      return {
        success: false,
        error: {
          code: 'PATIENT_NOT_FOUND',
          message: 'The requested patient could not be found',
          statusCode: 404,
        },
      };
    }

    return { success: true, data: patient };
  }

  async createPatient(clinicId: string, createPatientDto: CreatePatientDto) {
    const patient = await this.prisma.client.patient.create({
      data: {
        ...createPatientDto,
        clinicId,
        status: 'Active',
        allergies: createPatientDto.allergies || [],
      },
    });

    return {
      success: true,
      message: 'Patient created successfully',
      data: patient,
    };
  }

  async updatePatient(
    clinicId: string,
    patientId: string,
    updatePatientDto: UpdatePatientDto,
  ) {
    const patient = await this.prisma.client.patient.findFirst({
      where: { id: patientId, clinicId },
    });

    if (!patient) {
      return {
        success: false,
        error: {
          code: 'PATIENT_NOT_FOUND',
          message: 'The requested patient could not be found',
          statusCode: 404,
        },
      };
    }

    const updated = await this.prisma.client.patient.update({
      where: { id: patientId },
      data: updatePatientDto,
    });

    return {
      success: true,
      message: 'Patient updated successfully',
      data: updated,
    };
  }

  async deletePatient(clinicId: string, patientId: string) {
    const patient = await this.prisma.client.patient.findFirst({
      where: { id: patientId, clinicId },
    });

    if (!patient) {
      return {
        success: false,
        error: {
          code: 'PATIENT_NOT_FOUND',
          message: 'The requested patient could not be found',
          statusCode: 404,
        },
      };
    }

    await this.prisma.client.patient.delete({
      where: { id: patientId },
    });

    return {
      success: true,
      message: 'Patient deleted successfully',
    };
  }
}
