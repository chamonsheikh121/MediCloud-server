import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateMedicineDto } from './dto/create-medicine.dto';
import { UpdateMedicineStockDto } from './dto/update-stock.dto';

@Injectable()
export class PharmacyService {
  constructor(private prisma: PrismaService) {}

  async getAllMedicines(
    clinicId: string,
    limit: number = 20,
    offset: number = 0,
    category?: string,
    search?: string,
    lowStock?: boolean,
  ) {
    const where: any = { clinicId };

    if (category) {
      where.category = category;
    }

    if (search) {
      where.name = { contains: search, mode: 'insensitive' };
    }

    if (lowStock) {
      where.stock = { lte: where.reorderLevel };
    }

    const [medicines, total] = await Promise.all([
      this.prisma.client.medicine.findMany({
        where,
        take: limit,
        skip: offset,
        orderBy: { name: 'asc' },
      }),
      this.prisma.client.medicine.count({ where }),
    ]);

    return {
      success: true,
      data: medicines,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    };
  }

  async getMedicineById(clinicId: string, medicineId: string) {
    const medicine = await this.prisma.client.medicine.findFirst({
      where: { id: medicineId, clinicId },
    });

    if (!medicine) {
      return {
        success: false,
        error: {
          code: 'MEDICINE_NOT_FOUND',
          message: 'Medicine not found',
          statusCode: 404,
        },
      };
    }

    return { success: true, data: medicine };
  }

  async createMedicine(clinicId: string, createMedicineDto: CreateMedicineDto) {
    const medicine = await this.prisma.client.medicine.create({
      data: {
        clinicId,
        ...createMedicineDto,
      },
    });

    return {
      success: true,
      message: 'Medicine created successfully',
      data: medicine,
    };
  }

  async updateMedicineStock(
    clinicId: string,
    medicineId: string,
    updateStockDto: UpdateMedicineStockDto,
  ) {
    const medicine = await this.prisma.client.medicine.findFirst({
      where: { id: medicineId, clinicId },
    });

    if (!medicine) {
      return {
        success: false,
        error: {
          code: 'MEDICINE_NOT_FOUND',
          message: 'Medicine not found',
          statusCode: 404,
        },
      };
    }

    let newStock = medicine.stock;
    if (updateStockDto.operation === 'add') {
      newStock += updateStockDto.quantity;
    } else {
      newStock = Math.max(0, newStock - updateStockDto.quantity);
    }

    const updated = await this.prisma.client.medicine.update({
      where: { id: medicineId },
      data: { stock: newStock },
    });

    return {
      success: true,
      message: 'Stock updated successfully',
      data: updated,
    };
  }
}
