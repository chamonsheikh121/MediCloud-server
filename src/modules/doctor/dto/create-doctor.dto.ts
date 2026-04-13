import { IsString, IsNumber, IsOptional, IsArray, IsEmail } from 'class-validator';

export class CreateDoctorDto {
  @IsString()
  name: string;

  @IsString()
  specialization: string;

  @IsArray()
  @IsOptional()
  qualifications?: string[];

  @IsString()
  licenseNumber: string;

  @IsNumber()
  consultationFee: number;

  @IsString()
  schedule: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  phone: string;

  @IsOptional()
  @IsString()
  experience?: string;
}
