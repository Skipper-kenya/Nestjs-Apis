import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
const cookieParser = require('cookie-parser');

async function bootstrap() {
  dotenv.config();

  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3005;
  app.enableCors({
    credentials: true,
    origin: process.env.CLIENT_URI,
  });

  app.use(cookieParser());
  await app.listen(port, () => console.log(`running at port ${port}`));
}
bootstrap();
