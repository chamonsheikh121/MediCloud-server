import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { CurrentUser } from 'src/common/decorators';
import { InvoiceService } from './invoice.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { MarkInvoicePaidDto } from './dto/mark-paid.dto';

@Controller('invoices')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Get()
  async getAllInvoices(
    @CurrentUser() user: any,
    @Query('limit') limit: string = '20',
    @Query('offset') offset: string = '0',
    @Query('patientId') patientId?: string,
    @Query('status') status?: string,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
  ) {
    return this.invoiceService.getAllInvoices(
      user.clinicId,
      parseInt(limit),
      parseInt(offset),
      patientId,
      status,
      dateFrom,
      dateTo,
    );
  }

  @Get(':invoiceId')
  async getInvoiceById(
    @CurrentUser() user: any,
    @Param('invoiceId') invoiceId: string,
  ) {
    return this.invoiceService.getInvoiceById(user.clinicId, invoiceId);
  }

  @Post()
  async createInvoice(
    @CurrentUser() user: any,
    @Body() createInvoiceDto: CreateInvoiceDto,
  ) {
    return this.invoiceService.createInvoice(user.clinicId, createInvoiceDto);
  }

  @Post(':invoiceId/mark-paid')
  async markAsPaid(
    @CurrentUser() user: any,
    @Param('invoiceId') invoiceId: string,
    @Body() markPaidDto: MarkInvoicePaidDto,
  ) {
    return this.invoiceService.markAsPaid(user.clinicId, invoiceId, markPaidDto);
  }
}
