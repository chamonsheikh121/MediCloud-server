import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';

@Injectable()
export class DoctorService {
  constructor(private prisma: PrismaService) {}

  async getAllDoctors(
    clinicId: string,
    limit: number = 20,
    offset: number = 0,
    specialization?: string,
    availability?: string,
    sortBy: string = 'name',
    sortOrder: string = 'asc',
  ) {
    const where: any = { clinicId };

    if (specialization) {
      where.specialization = specialization;
    }

    if (availability) {
      where.availability = availability;
    }

    const [doctors, total] = await Promise.all([
      this.prisma.client.doctor.findMany({
        where,
        take: limit,
        skip: offset,
        orderBy: { [sortBy]: sortOrder },
      }),
      this.prisma.client.doctor.count({ where }),
    ]);

    return {
      success: true,
      data: doctors,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    };
  }

  async getDoctorById(clinicId: string, doctorId: string) {
    const doctor = await this.prisma.client.doctor.findFirst({
      where: { id: doctorId, clinicId },
    });

    if (!doctor) {
      return {
        success: false,
        error: {
          code: 'DOCTOR_NOT_FOUND',
          message: 'Doctor with given ID does not exist',
          statusCode: 404,
        },
      };
    }

    return { success: true, data: doctor };
  }

  async createDoctor(clinicId: string, createDoctorDto: CreateDoctorDto) {
    // First create user
    const user = await this.prisma.client.user.create({
      data: {
        clinicId,
        email: createDoctorDto.email,
        password: '', // Will be set during onboarding
        name: createDoctorDto.name,
        role: 'doctor',
        permissions: ['read:patients', 'write:appointments', 'read:billing'],
      },
    });

    // Then create doctor
    const doctor = await this.prisma.client.doctor.create({
      data: {
        clinicId,
        userId: user.id,
        name: createDoctorDto.name,
        specialization: createDoctorDto.specialization,
        qualifications: createDoctorDto.qualifications || [],
        licenseNumber: createDoctorDto.licenseNumber,
        email: createDoctorDto.email,
        phone: createDoctorDto.phone,
        consultationFee: createDoctorDto.consultationFee,
        schedule: createDoctorDto.schedule,
        experience: createDoctorDto.experience || '',
        availability: 'Available',
      },
    });

    return {
      success: true,
      message: 'Doctor created successfully',
      data: doctor,
    };
  }

  async updateDoctor(
    clinicId: string,
    doctorId: string,
    updateDoctorDto: UpdateDoctorDto,
  ) {
    const doctor = await this.prisma.client.doctor.findFirst({
      where: { id: doctorId, clinicId },
    });

    if (!doctor) {
      return {
        success: false,
        error: {
          code: 'DOCTOR_NOT_FOUND',
          message: 'Doctor with given ID does not exist',
          statusCode: 404,
        },
      };
    }

    const updated = await this.prisma.client.doctor.update({
      where: { id: doctorId },
      data: updateDoctorDto,
    });

    return {
      success: true,
      message: 'Doctor updated successfully',
      data: updated,
    };
  }

  async deleteDoctor(clinicId: string, doctorId: string) {
    const doctor = await this.prisma.client.doctor.findFirst({
      where: { id: doctorId, clinicId },
    });

    if (!doctor) {
      return {
        success: false,
        error: {
          code: 'DOCTOR_NOT_FOUND',
          message: 'Doctor with given ID does not exist',
          statusCode: 404,
        },
      };
    }

    await this.prisma.client.doctor.delete({
      where: { id: doctorId },
    });

    return {
      success: true,
      message: 'Doctor deleted successfully',
    };
  }
}
