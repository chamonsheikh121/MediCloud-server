import { IsString, IsOptional } from 'class-validator';

export class CreateTelemedicineConsultationDto {
  @IsString()
  patientId: string;

  @IsString()
  doctorId: string;

  @IsString()
  date: string;

  @IsString()
  time: string;

  @IsOptional()
  duration?: number;
}
