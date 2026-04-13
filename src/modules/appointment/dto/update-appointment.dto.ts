import { IsString, IsOptional } from 'class-validator';

export class UpdateAppointmentDto {
  @IsOptional()
  @IsString()
  date?: string;

  @IsOptional()
  @IsString()
  time?: string;

  @IsOptional()
  @IsString()
  status?: 'Confirmed' | 'Pending' | 'Completed' | 'Cancelled';

  @IsOptional()
  @IsString()
  notes?: string;
}
