import { IsString, IsArray, IsOptional } from 'class-validator';

export class CreatePrescriptionDto {
  @IsString()
  patientId: string;

  @IsString()
  doctorId: string;

  @IsArray()
  medicines: Array<{
    medicineId: string;
    dosage: string;
    frequency: string;
    duration: string;
  }>;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  appointmentId?: string;
}
