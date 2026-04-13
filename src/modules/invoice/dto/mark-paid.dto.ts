import { IsString } from 'class-validator';

export class MarkInvoicePaidDto {
  @IsString()
  paymentMethod: string;

  @IsString()
  transactionId: string;
}
