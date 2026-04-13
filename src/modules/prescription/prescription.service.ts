import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';

@Injectable()
export class PrescriptionService {
  constructor(private prisma: PrismaService) {}

  async getPrescriptionById(clinicId: string, prescriptionId: string) {
    const prescription = await this.prisma.client.prescription.findFirst({
      where: { id: prescriptionId, clinicId },
      include: { items: { include: { medicine: true } } },
    });

    if (!prescription) {
      return {
        success: false,
        error: {
          code: 'PRESCRIPTION_NOT_FOUND',
          message: 'Prescription not found',
          statusCode: 404,
        },
      };
    }

    return { success: true, data: prescription };
  }

  async createPrescription(
    clinicId: string,
    createPrescriptionDto: CreatePrescriptionDto,
    doctorUserId: string,
  ) {
    // Verify patient
    const patient = await this.prisma.client.patient.findFirst({
      where: { id: createPrescriptionDto.patientId, clinicId },
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

    // Verify doctor
    const doctor = await this.prisma.client.doctor.findFirst({
      where: { id: createPrescriptionDto.doctorId, clinicId },
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

    // Create prescription with items
    const prescription = await this.prisma.client.prescription.create({
      data: {
        clinicId,
        patientId: createPrescriptionDto.patientId,
        doctorId: createPrescriptionDto.doctorId,
        doctorUserId,
        appointmentId: createPrescriptionDto.appointmentId,
        notes: createPrescriptionDto.notes,
        items: {
          create: createPrescriptionDto.medicines.map((medicine) => ({
            medicineId: medicine.medicineId,
            dosage: medicine.dosage,
            frequency: medicine.frequency,
            duration: medicine.duration,
          })),
        },
      },
      include: { items: { include: { medicine: true } } },
    });

    return {
      success: true,
      message: 'Prescription issued successfully',
      data: prescription,
    };
  }

  async getPrescriptionsByPatient(
    clinicId: string,
    patientId: string,
    limit: number = 20,
    offset: number = 0,
  ) {
    const [prescriptions, total] = await Promise.all([
      this.prisma.client.prescription.findMany({
        where: { clinicId, patientId },
        take: limit,
        skip: offset,
        include: { items: { include: { medicine: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.client.prescription.count({
        where: { clinicId, patientId },
      }),
    ]);

    return {
      success: true,
      data: prescriptions,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    };
  }
}
