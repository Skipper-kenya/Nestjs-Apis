import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PaymentDetails, PaymentDetailsSchema } from './schema/payment.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PaymentDetails.name, schema: PaymentDetailsSchema },
    ]),
  ],
  providers: [PaymentService],
  controllers: [PaymentController],
})
export class PaymentModule {}
