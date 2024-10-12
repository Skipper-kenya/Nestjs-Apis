import { HttpStatus, Injectable } from '@nestjs/common';
import axios from 'axios';
import { Response, json } from 'express';
import { StkCallbackResponse } from './payment.controller';
import { InjectModel } from '@nestjs/mongoose';
import { PaymentDetails } from './schema/payment.schema';
import { Model } from 'mongoose';
const request = require('request');

interface TokenResponse {
  access_token: string;
  expires_in: string;
}

@Injectable()
export class PaymentService {
  constructor(
    @InjectModel(PaymentDetails.name)
    private readonly paymentModel: Model<PaymentDetails>,
  ) {}

  private url =
    'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest';
  private ConsumerKey = process.env.CONSUMERKEY;
  private ConsumerSecret = process.env.CONSUMERSECRET;
  private Passkey = process.env.PASSKEY;
  private shortcode = process.env.SHORTCODE;
  private callbackUrl = process.env.CALLBACKURL;

  encodeToBase64() {
    return Buffer.from(`${this.ConsumerKey}:${this.ConsumerSecret}`).toString(
      'base64',
    );
  }

  //token generating method
  async generateToken(): Promise<TokenResponse> {
    const token = this.encodeToBase64();

    try {
      const response = await axios.get(
        'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
        {
          headers: {
            Authorization: 'Basic ' + token,
          },
        },
      );

      return response.data;
    } catch (error) {
      console.log(error.message);
    }
  }

  //method to generate timestamp
  generateTimestamp(): string {
    const now = new Date();

    const year = now.getFullYear().toString();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const date = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');

    return `${year}${month}${date}${hours}${minutes}${seconds}`;
  }

  generatePassword(
    shortCode: Number,
    passkey: string,
    timestamp: string,
  ): string {
    return Buffer.from(shortCode + passkey + timestamp).toString('base64');
  }

  async handleStkPush(details: any, res): Promise<any> {
    try {
      const { PhoneNo: PhoneNumber, Amount } = details;

      const auth = (await this.generateToken()).access_token;

      request(
        {
          url: this.url,
          method: 'POST',
          headers: {
            Authorization: 'Bearer ' + auth,
          },
          json: {
            BusinessShortCode: Number(this.shortcode),
            Password: this.generatePassword(
              Number(this.shortcode),
              this.Passkey,
              this.generateTimestamp(),
            ),
            Timestamp: this.generateTimestamp(),
            TransactionType: 'CustomerPayBillOnline',
            Amount,
            PartyA: 254745634043,
            PartyB: Number(this.shortcode),
            PhoneNumber: 254745634043,
            CallBackURL: `${this.callbackUrl}/payment/callback`,
            AccountReference: 'E-Commerce Order',
            TransactionDesc: 'Order Payment',
          },
        },
        (err: any, _response: any, body: any) => {
          if (err) {
            console.log(err.message);
            return err.message;
          } else {
            return res.status(HttpStatus.OK).json({
              body: body,
            });
          }
        },
      );
    } catch (error) {
      console.log(error.message);
    }
  }

  async handleCallback(details: any, res: Response): Promise<any> {
    try {
      const { stkCallback } = details.Body;

      const { ResultCode, MerchantRequestID, CheckoutRequestID, ResultDesc } =
        stkCallback;

      if (ResultCode == 0) {
        if (stkCallback && stkCallback.CallbackMetadata) {
          const metadataItems = stkCallback.CallbackMetadata.Item;

          const amount = metadataItems.find(
            (item: any) => item.Name === 'Amount',
          )?.Value;
          const receiptNumber = metadataItems.find(
            (item: any) => item.Name === 'MpesaReceiptNumber',
          )?.Value;
          const transactionDate = metadataItems.find(
            (item: any) => item.Name === 'TransactionDate',
          )?.Value;
          const phoneNumber = metadataItems.find(
            (item: any) => item.Name === 'PhoneNumber',
          )?.Value;

          const data = {
            MerchantRequestID,
            CheckoutRequestID,
            ResultDesc,
            Amount: amount,
            MpesaReceiptNumber: receiptNumber,
            TransactionDate: transactionDate,
            PhoneNumber: phoneNumber,
          };

          //db

          const newTransaction = new this.paymentModel(data);
          await newTransaction.save();

          return res.status(HttpStatus.OK).json({
            message: ResultDesc,
            success: true,
            data,
          });
        }
      } else {
        res.status(HttpStatus.OK).json({
          message: ResultDesc,
          success: false,
        });
      }
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ success: false, message: 'invalid data please try again' });
    }
  }
}
