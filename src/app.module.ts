import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { FlavorModule } from './flavors/flavors.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    FlavorModule,
    MongooseModule.forRoot(process.env.MONGO_DB_URL),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
