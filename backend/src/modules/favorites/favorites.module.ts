import { Module } from '@nestjs/common';
import { RoutingModule } from '../routing/routing.module';
import { FavoritesController } from './favorites.controller';

@Module({
  imports: [RoutingModule],
  controllers: [FavoritesController],
})
export class FavoritesModule {}
