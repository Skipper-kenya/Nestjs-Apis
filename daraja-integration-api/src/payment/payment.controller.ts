import { Body, Controller, Get, HttpStatus, Post, Res } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Response } from 'express';

export interface StkCallbackResponse {
  Body: {
    stkCallback: {
      MerchantRequestID: string;
      CheckoutRequestID: string;
      ResultCode: number;
      ResultDesc: string;
      CallbackMetadata: {
        Item: Array<{
          Name: string;
          Value?: string | number;
        }>;
      };
    };
  };
}

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get('accessToken')
  async generateToken(): Promise<any> {
    return await this.paymentService.generateToken();
  }

  @Post('stkPush')
  async handleStkPush(
    @Body() details: { Amount: Number; PhoneNo: Number },
    @Res() res: Response,
  ): Promise<any> {
    return await this.paymentService.handleStkPush(details, res);
  }

  @Post('callback')
  async handleCallback(
    @Body() details: any,
    @Res() res: Response,
  ): Promise<any> {
    return this.paymentService.handleCallback(details, res);
  }

  @Post('timeout')
  async handleTimeout() {
    console.log('timeout expirienced');
  }
}
