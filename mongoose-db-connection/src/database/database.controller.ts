import { Controller, Post, Request } from '@nestjs/common';
import { DatabaseService } from './database.service';

@Controller('database')
export class DatabaseController {
  constructor(private readonly databaseService: DatabaseService) {}

  @Post('register')
  async registerUser(@Request() req: any) {
    const userDetails = req.body;

    await this.databaseService.registerUser(userDetails);
  }
}
