import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class PaymentDetails {
  @Prop({ required: true })
  MerchantRequestID: string;
  @Prop({ required: true })
  CheckoutRequestID: string;
  @Prop({ required: true })
  ResultDesc: string;
  @Prop({ required: true })
  Amount: Number;
  @Prop({ required: true })
  MpesaReceiptNumber: string;
  @Prop({ required: true })
  TransactionDate: Number;
  @Prop({ required: true })
  PhoneNumber: Number;
}

export const PaymentDetailsSchema =
  SchemaFactory.createForClass(PaymentDetails);
