import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getDashboardAnalytics(
    clinicId: string,
    period: string = 'month',
    dateFrom?: string,
    dateTo?: string,
  ) {
    // Get basic counts
    const [totalPatients, totalAppointments, totalRevenue, averageRating] =
      await Promise.all([
        this.prisma.client.patient.count({ where: { clinicId } }),
        this.prisma.client.appointment.count({ where: { clinicId } }),
        this.prisma.client.invoice.aggregate({
          where: { clinicId, status: 'Paid' },
          _sum: { amount: true },
        }),
        this.prisma.client.doctor.aggregate({
          where: { clinicId },
          _avg: { rating: true },
        }),
      ]);

    // Get appointment status breakdown
    const appointmentsByStatus = await this.prisma.client.appointment.groupBy({
      by: ['status'],
      where: { clinicId },
      _count: true,
    });

    // Mock revenue by month data
    const revenueByMonth = [
      { month: 'Jan', revenue: 42000, patients: 320 },
      { month: 'Feb', revenue: 38000, patients: 290 },
      { month: 'Mar', revenue: 45000, patients: 340 },
      { month: 'Apr', revenue: 28500, patients: 280 },
    ];

    return {
      success: true,
      data: {
        totalPatients,
        activePatients: Math.round(totalPatients * 0.87),
        totalAppointments,
        completedAppointments: appointmentsByStatus.find(
          (a) => a.status === 'Completed',
        )?._count || 0,
        totalRevenue: totalRevenue._sum.amount || 0,
        averageRating: averageRating._avg.rating || 0,
        revenueByMonth,
        appointmentsByStatus: Object.fromEntries(
          appointmentsByStatus.map((a) => [a.status, a._count]),
        ),
      },
    };
  }

  async getClinicInfo(clinicId: string) {
    const clinic = await this.prisma.client.clinic.findUnique({
      where: { id: clinicId },
    });

    if (!clinic) {
      return {
        success: false,
        error: {
          code: 'CLINIC_NOT_FOUND',
          message: 'Clinic not found',
          statusCode: 404,
        },
      };
    }

    return { success: true, data: clinic };
  }

  async getClinicStatistics(clinicId: string) {
    const [
      totalPatients,
      newPatientsThisMonth,
      activeAppointments,
      completedAppointments,
      activeUsers,
    ] = await Promise.all([
      this.prisma.client.patient.count({ where: { clinicId } }),
      this.prisma.client.patient.count({
        where: {
          clinicId,
          createdAt: {
            gte: new Date(new Date().setDate(1)),
          },
        },
      }),
      this.prisma.client.appointment.count({
        where: { clinicId, status: 'Confirmed' },
      }),
      this.prisma.client.appointment.count({
        where: { clinicId, status: 'Completed' },
      }),
      this.prisma.client.user.count({ where: { clinicId } }),
    ]);

    const totalRevenue = await this.prisma.client.invoice.aggregate({
      where: {
        clinicId,
        createdAt: {
          gte: new Date(new Date().setDate(1)),
        },
      },
      _sum: { amount: true },
    });

    return {
      success: true,
      data: {
        totalPatients,
        newPatientsThisMonth,
        activeAppointments,
        completedAppointments,
        monthlyRevenue: totalRevenue._sum.amount || 0,
        storageUsed: '450/1000 GB',
        activeUsers,
        systemUptime: '99.98%',
      },
    };
  }
}
