import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateMedicineDto {
  @IsString()
  name: string;

  @IsString()
  category: string;

  @IsNumber()
  stock: number;

  @IsString()
  expiry: string;

  @IsNumber()
  price: number;

  @IsString()
  supplier: string;

  @IsNumber()
  reorderLevel: number;
}
