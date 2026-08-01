import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Preferences } from '../../entities/preferences.entity';
import { GenerateRouteDto } from '../routing/dto/generate-route.dto';

@Injectable()
export class PreferencesService {
  constructor(@InjectRepository(Preferences) private readonly repo: Repository<Preferences>) {}

  findLatestForUser(userId: string): Promise<Preferences | null> {
    return this.repo.findOne({ where: { userId }, order: { createdAt: 'DESC' } });
  }

  /** Persists the preferences submitted alongside a route-generation request. */
  async saveFromGenerateDto(userId: string, bikeId: string, dto: GenerateRouteDto): Promise<Preferences> {
    const entity = this.repo.create({
      userId,
      bikeId,
      distanceKm: dto.distanceKm,
      durationMinutes: dto.durationMinutes,
      difficulty: dto.difficulty,
      elevationProfile: dto.elevationProfile,
      elevationCustomM: dto.elevationCustomM,
      priority: dto.priority,
      isLoop: dto.isLoop ?? true,
      avoidGravel: dto.avoidGravel ?? false,
      avoidDirt: dto.avoidDirt ?? false,
      avoidForest: dto.avoidForest ?? false,
      avoidCityCenter: dto.avoidCityCenter ?? true,
      avoidTraffic: dto.avoidTraffic ?? true,
      avoidTrunkRoads: dto.avoidTrunkRoads ?? true,
      avoidNoBikeLane: dto.avoidNoBikeLane ?? false,
      avoidIndustrial: dto.avoidIndustrial ?? true,
      avoidRoadworks: dto.avoidRoadworks ?? true,
      followBikeLanes: dto.followBikeLanes ?? true,
      preferSmallRoads: dto.preferSmallRoads ?? true,
      avoidTrafficLights: dto.avoidTrafficLights ?? false,
      avoidStopSigns: dto.avoidStopSigns ?? false,
      preferRiverside: dto.preferRiverside ?? false,
      preferVineyards: dto.preferVineyards ?? false,
      preferViewpoints: dto.preferViewpoints ?? true,
      preferLakes: dto.preferLakes ?? false,
      preferOcean: dto.preferOcean ?? false,
    });
    return this.repo.save(entity);
  }
}
