import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateTelemedicineConsultationDto } from './dto/create-consultation.dto';

@Injectable()
export class TelemedicineService {
  constructor(private prisma: PrismaService) {}

  async getConsultations(
    clinicId: string,
    limit: number = 20,
    offset: number = 0,
    status?: string,
    patientId?: string,
    doctorId?: string,
  ) {
    const where: any = { clinicId };

    if (status) {
      where.status = status;
    }

    if (patientId) {
      where.patientId = patientId;
    }

    if (doctorId) {
      where.doctorId = doctorId;
    }

    const [consultations, total] = await Promise.all([
      this.prisma.client.telemedicineConsultation.findMany({
        where,
        take: limit,
        skip: offset,
        orderBy: { date: 'asc' },
      }),
      this.prisma.client.telemedicineConsultation.count({ where }),
    ]);

    return {
      success: true,
      data: consultations,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    };
  }

  async createConsultation(
    clinicId: string,
    createConsultationDto: CreateTelemedicineConsultationDto,
    doctorUserId: string,
  ) {
    const patient = await this.prisma.client.patient.findFirst({
      where: { id: createConsultationDto.patientId, clinicId },
    });

    if (!patient) {
      return {
        success: false,
        error: {
          code: 'PATIENT_NOT_FOUND',
          message: 'Patient not found',
          statusCode: 404,
        },
      };
    }

    const doctor = await this.prisma.client.doctor.findFirst({
      where: { id: createConsultationDto.doctorId, clinicId },
    });

    if (!doctor) {
      return {
        success: false,
        error: {
          code: 'DOCTOR_NOT_FOUND',
          message: 'Doctor not found',
          statusCode: 404,
        },
      };
    }

    const consultation = await this.prisma.client.telemedicineConsultation.create(
      {
        data: {
          clinicId,
          patientId: createConsultationDto.patientId,
          doctorId: createConsultationDto.doctorId,
          doctorUserId,
          date: createConsultationDto.date,
          time: createConsultationDto.time,
          duration: createConsultationDto.duration || 30,
          status: 'Scheduled',
          meetingUrl: `https://meet.medicloud.io/${Math.random().toString(36).substr(2, 9)}`,
        },
      },
    );

    return {
      success: true,
      message: 'Consultation scheduled',
      data: consultation,
    };
  }

  async startConsultation(clinicId: string, consultationId: string) {
    const consultation =
      await this.prisma.client.telemedicineConsultation.findFirst({
        where: { id: consultationId, clinicId },
      });

    if (!consultation) {
      return {
        success: false,
        error: {
          code: 'CONSULTATION_NOT_FOUND',
          message: 'Consultation not found',
          statusCode: 404,
        },
      };
    }

    const updated =
      await this.prisma.client.telemedicineConsultation.update({
        where: { id: consultationId },
        data: { status: 'Active' },
      });

    return {
      success: true,
      data: {
        consultationId: updated.id,
        meetingUrl: updated.meetingUrl,
        status: 'Active',
        sessionToken: Math.random().toString(36).substr(2, 20),
        expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      },
    };
  }
}
