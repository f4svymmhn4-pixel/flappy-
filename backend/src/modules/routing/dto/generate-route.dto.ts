import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsIn,
  IsInt,
  IsLatitude,
  IsLongitude,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { BikeType } from '../../../entities/bike.entity';
import { Difficulty, ElevationProfile, Priority } from '../../../entities/preferences.entity';

class StartPointDto {
  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsLatitude()
  lat?: number;

  @IsOptional()
  @IsLongitude()
  lon?: number;
}

export class GenerateRouteDto {
  @ValidateNested()
  @Type(() => StartPointDto)
  start!: StartPointDto;

  @IsIn(['road', 'gravel', 'mtb', 'electric', 'city'])
  bikeType!: BikeType;

  @IsOptional()
  @IsUUID()
  bikeId?: string;

  @IsNumber()
  @Min(1)
  @Max(400)
  distanceKm!: number;

  @IsOptional()
  @IsInt()
  durationMinutes?: number;

  @IsIn(['very_easy', 'easy', 'medium', 'sporty', 'very_sporty'])
  difficulty!: Difficulty;

  @IsIn(['very_flat', 'flat', 'some_hills', 'rolling', 'mountain', 'custom'])
  elevationProfile!: ElevationProfile;

  @IsOptional()
  @IsInt()
  elevationCustomM?: number;

  @IsIn([
    'tourism',
    'performance',
    'scenery',
    'quiet_roads',
    'max_bike_lanes',
    'climbing',
    'descent',
    'training',
    'leisure',
  ])
  priority!: Priority;

  @IsOptional()
  @IsBoolean()
  isLoop?: boolean;

  @IsOptional()
  @IsBoolean()
  avoidGravel?: boolean;

  @IsOptional()
  @IsBoolean()
  avoidDirt?: boolean;

  @IsOptional()
  @IsBoolean()
  avoidForest?: boolean;

  @IsOptional()
  @IsBoolean()
  avoidCityCenter?: boolean;

  @IsOptional()
  @IsBoolean()
  avoidTraffic?: boolean;

  @IsOptional()
  @IsBoolean()
  avoidTrunkRoads?: boolean;

  @IsOptional()
  @IsBoolean()
  avoidNoBikeLane?: boolean;

  @IsOptional()
  @IsBoolean()
  avoidIndustrial?: boolean;

  @IsOptional()
  @IsBoolean()
  avoidRoadworks?: boolean;

  @IsOptional()
  @IsBoolean()
  followBikeLanes?: boolean;

  @IsOptional()
  @IsBoolean()
  preferSmallRoads?: boolean;

  @IsOptional()
  @IsBoolean()
  avoidTrafficLights?: boolean;

  @IsOptional()
  @IsBoolean()
  avoidStopSigns?: boolean;

  @IsOptional()
  @IsBoolean()
  preferRiverside?: boolean;

  @IsOptional()
  @IsBoolean()
  preferVineyards?: boolean;

  @IsOptional()
  @IsBoolean()
  preferViewpoints?: boolean;

  @IsOptional()
  @IsBoolean()
  preferLakes?: boolean;

  @IsOptional()
  @IsBoolean()
  preferOcean?: boolean;
}
