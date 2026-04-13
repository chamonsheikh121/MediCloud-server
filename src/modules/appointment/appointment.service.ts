import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

@Injectable()
export class AppointmentService {
  constructor(private prisma: PrismaService) {}

  async getAllAppointments(
    clinicId: string,
    limit: number = 20,
    offset: number = 0,
    patientId?: string,
    doctorId?: string,
    status?: string,
    dateFrom?: string,
    dateTo?: string,
    sortBy: string = 'date',
    sortOrder: string = 'asc',
  ) {
    const where: any = { clinicId };

    if (patientId) {
      where.patientId = patientId;
    }

    if (doctorId) {
      where.doctorId = doctorId;
    }

    if (status) {
      where.status = status;
    }

    if (dateFrom || dateTo) {
      where.date = {};
      if (dateFrom) {
        where.date.gte = dateFrom;
      }
      if (dateTo) {
        where.date.lte = dateTo;
      }
    }

    const [appointments, total] = await Promise.all([
      this.prisma.client.appointment.findMany({
        where,
        take: limit,
        skip: offset,
        orderBy: { [sortBy]: sortOrder },
      }),
      this.prisma.client.appointment.count({ where }),
    ]);

    return {
      success: true,
      data: appointments,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    };
  }

  async getAppointmentById(clinicId: string, appointmentId: string) {
    const appointment = await this.prisma.client.appointment.findFirst({
      where: { id: appointmentId, clinicId },
    });

    if (!appointment) {
      return {
        success: false,
        error: {
          code: 'APPOINTMENT_NOT_FOUND',
          message: 'Appointment with given ID does not exist',
          statusCode: 404,
        },
      };
    }

    return { success: true, data: appointment };
  }

  async createAppointment(
    clinicId: string,
    createAppointmentDto: CreateAppointmentDto,
    doctorUserId: string,
  ) {
    // Check if patient exists
    const patient = await this.prisma.client.patient.findFirst({
      where: { id: createAppointmentDto.patientId, clinicId },
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

    // Check if doctor exists
    const doctor = await this.prisma.client.doctor.findFirst({
      where: { id: createAppointmentDto.doctorId, clinicId },
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

    const appointment = await this.prisma.client.appointment.create({
      data: {
        clinicId,
        patientId: createAppointmentDto.patientId,
        doctorId: createAppointmentDto.doctorId,
        doctorUserId,
        date: createAppointmentDto.date,
        time: createAppointmentDto.time,
        type: createAppointmentDto.type,
        notes: createAppointmentDto.notes,
        duration: createAppointmentDto.duration || 30,
        status: 'Pending',
      },
    });

    return {
      success: true,
      message: 'Appointment scheduled successfully',
      data: appointment,
    };
  }

  async updateAppointment(
    clinicId: string,
    appointmentId: string,
    updateAppointmentDto: UpdateAppointmentDto,
  ) {
    const appointment = await this.prisma.client.appointment.findFirst({
      where: { id: appointmentId, clinicId },
    });

    if (!appointment) {
      return {
        success: false,
        error: {
          code: 'APPOINTMENT_NOT_FOUND',
          message: 'Appointment with given ID does not exist',
          statusCode: 404,
        },
      };
    }

    const updated = await this.prisma.client.appointment.update({
      where: { id: appointmentId },
      data: updateAppointmentDto,
    });

    return {
      success: true,
      message: 'Appointment updated successfully',
      data: updated,
    };
  }

  async cancelAppointment(
    clinicId: string,
    appointmentId: string,
    reason?: string,
  ) {
    const appointment = await this.prisma.client.appointment.findFirst({
      where: { id: appointmentId, clinicId },
    });

    if (!appointment) {
      return {
        success: false,
        error: {
          code: 'APPOINTMENT_NOT_FOUND',
          message: 'Appointment with given ID does not exist',
          statusCode: 404,
        },
      };
    }

    const updated = await this.prisma.client.appointment.update({
      where: { id: appointmentId },
      data: { status: 'Cancelled' },
    });

    return {
      success: true,
      message: 'Appointment cancelled successfully',
      data: updated,
    };
  }
}
