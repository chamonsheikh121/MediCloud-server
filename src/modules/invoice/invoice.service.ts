import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { MarkInvoicePaidDto } from './dto/mark-paid.dto';

@Injectable()
export class InvoiceService {
  constructor(private prisma: PrismaService) {}

  async getAllInvoices(
    clinicId: string,
    limit: number = 20,
    offset: number = 0,
    patientId?: string,
    status?: string,
    dateFrom?: string,
    dateTo?: string,
  ) {
    const where: any = { clinicId };

    if (patientId) {
      where.patientId = patientId;
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

    const [invoices, total] = await Promise.all([
      this.prisma.client.invoice.findMany({
        where,
        take: limit,
        skip: offset,
        orderBy: { date: 'desc' },
      }),
      this.prisma.client.invoice.count({ where }),
    ]);

    return {
      success: true,
      data: invoices,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    };
  }

  async getInvoiceById(clinicId: string, invoiceId: string) {
    const invoice = await this.prisma.client.invoice.findFirst({
      where: { id: invoiceId, clinicId },
    });

    if (!invoice) {
      return {
        success: false,
        error: {
          code: 'INVOICE_NOT_FOUND',
          message: 'Invoice not found',
          statusCode: 404,
        },
      };
    }

    return { success: true, data: invoice };
  }

  async createInvoice(clinicId: string, createInvoiceDto: CreateInvoiceDto) {
    const patient = await this.prisma.client.patient.findFirst({
      where: { id: createInvoiceDto.patientId, clinicId },
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

    // Calculate total amount
    const amount = createInvoiceDto.services.reduce(
      (sum, service) => sum + service.rate * (service.quantity || 1),
      0,
    );

    const today = new Date().toISOString().split('T')[0];
    const dueDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];

    const invoice = await this.prisma.client.invoice.create({
      data: {
        clinicId,
        patientId: createInvoiceDto.patientId,
        appointmentId: createInvoiceDto.appointmentId,
        amount,
        status: 'Pending',
        date: today,
        dueDate,
        services: createInvoiceDto.services.map((s) => s.name),
        notes: createInvoiceDto.notes,
      },
    });

    return {
      success: true,
      message: 'Invoice created successfully',
      data: invoice,
    };
  }

  async markAsPaid(
    clinicId: string,
    invoiceId: string,
    markPaidDto: MarkInvoicePaidDto,
  ) {
    const invoice = await this.prisma.client.invoice.findFirst({
      where: { id: invoiceId, clinicId },
    });

    if (!invoice) {
      return {
        success: false,
        error: {
          code: 'INVOICE_NOT_FOUND',
          message: 'Invoice not found',
          statusCode: 404,
        },
      };
    }

    const today = new Date().toISOString().split('T')[0];

    const updated = await this.prisma.client.invoice.update({
      where: { id: invoiceId },
      data: {
        status: 'Paid',
        paidDate: today,
        paymentMethod: markPaidDto.paymentMethod,
        transactionId: markPaidDto.transactionId,
      },
    });

    return {
      success: true,
      message: 'Invoice marked as paid',
      data: updated,
    };
  }
}
