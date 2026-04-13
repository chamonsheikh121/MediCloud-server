import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { CurrentUser } from 'src/common/decorators';
import { PharmacyService } from './pharmacy.service';
import { CreateMedicineDto } from './dto/create-medicine.dto';
import { UpdateMedicineStockDto } from './dto/update-stock.dto';

@Controller('pharmacy/medicines')
export class PharmacyController {
  constructor(private readonly pharmacyService: PharmacyService) {}

  @Get()
  async getAllMedicines(
    @CurrentUser() user: any,
    @Query('limit') limit: string = '20',
    @Query('offset') offset: string = '0',
    @Query('category') category?: string,
    @Query('search') search?: string,
    @Query('lowStock') lowStock?: boolean,
  ) {
    return this.pharmacyService.getAllMedicines(
      user.clinicId,
      parseInt(limit),
      parseInt(offset),
      category,
      search,
      lowStock,
    );
  }

  @Get(':medicineId')
  async getMedicineById(
    @CurrentUser() user: any,
    @Param('medicineId') medicineId: string,
  ) {
    return this.pharmacyService.getMedicineById(user.clinicId, medicineId);
  }

  @Post()
  async createMedicine(
    @CurrentUser() user: any,
    @Body() createMedicineDto: CreateMedicineDto,
  ) {
    return this.pharmacyService.createMedicine(user.clinicId, createMedicineDto);
  }

  @Put(':medicineId/stock')
  async updateMedicineStock(
    @CurrentUser() user: any,
    @Param('medicineId') medicineId: string,
    @Body() updateStockDto: UpdateMedicineStockDto,
  ) {
    return this.pharmacyService.updateMedicineStock(
      user.clinicId,
      medicineId,
      updateStockDto,
    );
  }
}
