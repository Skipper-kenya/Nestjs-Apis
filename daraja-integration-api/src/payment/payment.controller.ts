import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Response } from 'express';

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
  ): Promise<any> {
    return await this.paymentService.handleStkPush(details);
  }

  @Post('callback')
  handleCallback(details: any, @Res() res: Response) {
    this.paymentService.handleCallback(details);
    return res.status(200).send('ok');
  }
}
