import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './common/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { PatientModule } from './modules/patient/patient.module';
import { DoctorModule } from './modules/doctor/doctor.module';
import { AppointmentModule } from './modules/appointment/appointment.module';
import { InvoiceModule } from './modules/invoice/invoice.module';
import { PharmacyModule } from './modules/pharmacy/pharmacy.module';
import { PrescriptionModule } from './modules/prescription/prescription.module';
import { TelemedicineModule } from './modules/telemedicine/telemedicine.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UserModule,
    PatientModule,
    DoctorModule,
    AppointmentModule,
    InvoiceModule,
    PharmacyModule,
    PrescriptionModule,
    TelemedicineModule,
    AnalyticsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
