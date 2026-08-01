import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Route } from '../../entities/route.entity';
import { RouteStats } from '../../entities/route-stats.entity';
import { PoiModule } from '../poi/poi.module';
import { ElevationModule } from '../elevation/elevation.module';
import { BikesModule } from '../bikes/bikes.module';
import { PreferencesModule } from '../preferences/preferences.module';
import { ExportModule } from '../export/export.module';
import { OpenRouteServiceClient } from './providers/openrouteservice.client';
import { GraphHopperClient } from './providers/graphhopper.client';
import { ScoringService } from './scoring/scoring.service';
import { RouteGenerationService } from './route-generation.service';
import { GeocodingService } from './geocoding.service';
import { RoutesService } from './routes.service';
import { RoutingController } from './routing.controller';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([Route, RouteStats]),
    PoiModule,
    ElevationModule,
    BikesModule,
    PreferencesModule,
    ExportModule,
  ],
  providers: [
    OpenRouteServiceClient,
    GraphHopperClient,
    ScoringService,
    RouteGenerationService,
    GeocodingService,
    RoutesService,
  ],
  controllers: [RoutingController],
  exports: [RoutesService],
})
export class RoutingModule {}
