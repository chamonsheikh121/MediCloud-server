import { IsString, IsNumber, IsArray, IsOptional } from 'class-validator';

export class CreateInvoiceDto {
  @IsString()
  patientId: string;

  @IsOptional()
  @IsString()
  appointmentId?: string;

  @IsArray()
  services: Array<{ name: string; rate: number; quantity?: number }>;

  @IsOptional()
  @IsString()
  notes?: string;
}
