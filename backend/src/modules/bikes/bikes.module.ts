import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bike } from '../../entities/bike.entity';
import { BikesService } from './bikes.service';
import { BikesController } from './bikes.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Bike])],
  providers: [BikesService],
  controllers: [BikesController],
  exports: [BikesService],
})
export class BikesModule {}
