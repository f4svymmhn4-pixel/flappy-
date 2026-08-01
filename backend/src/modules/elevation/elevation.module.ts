import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ElevationService } from './elevation.service';

@Module({
  imports: [HttpModule],
  providers: [ElevationService],
  exports: [ElevationService],
})
export class ElevationModule {}
