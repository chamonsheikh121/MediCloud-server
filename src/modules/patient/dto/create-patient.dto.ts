import { IsString, IsInt, IsEmail, IsOptional, IsArray } from 'class-validator';

export class CreatePatientDto {
  @IsString()
  name: string;

  @IsInt()
  age: number;

  @IsString()
  gender: 'Male' | 'Female' | 'Other';

  @IsString()
  phone: string;

  @IsEmail()
  email: string;

  @IsString()
  blood: string;

  @IsString()
  address: string;

  @IsString()
  condition: string;

  @IsOptional()
  @IsString()
  medicalHistory?: string;

  @IsOptional()
  @IsArray()
  allergies?: string[];

  @IsOptional()
  @IsString()
  emergencyContactName?: string;

  @IsOptional()
  @IsString()
  emergencyContactPhone?: string;

  @IsOptional()
  @IsString()
  emergencyContactRelationship?: string;
}
