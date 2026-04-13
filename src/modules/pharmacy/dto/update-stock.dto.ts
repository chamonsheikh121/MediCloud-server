import { IsNumber, IsString } from 'class-validator';

export class UpdateMedicineStockDto {
  @IsNumber()
  quantity: number;

  @IsString()
  operation: 'add' | 'subtract';
}
