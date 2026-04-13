import { IsString, IsOptional } from 'class-validator';

export class CreateAppointmentDto {
  @IsString()
  patientId: string;

  @IsString()
  doctorId: string;

  @IsString()
  date: string;

  @IsString()
  time: string;

  @IsString()
  type: 'Follow-up' | 'Consultation' | 'Check-up' | 'New Patient' | 'Emergency';

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  duration?: number;
}
