import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { FlavorModule } from './flavors/flavors.module';
import { AuthModule } from './auth/auth.module';
import { CoffeeModule } from './coffee/coffee.module';
import { PaymentModule } from './payment/payment.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    FlavorModule,
    MongooseModule.forRoot(process.env.MONGO_DB_URL),
    AuthModule,
    CoffeeModule,
    PaymentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
