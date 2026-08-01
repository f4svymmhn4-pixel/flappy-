import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PoiService } from './poi.service';

@Module({
  imports: [HttpModule],
  providers: [PoiService],
  exports: [PoiService],
})
export class PoiModule {}
