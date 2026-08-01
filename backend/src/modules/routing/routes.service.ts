import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Route } from '../../entities/route.entity';
import { RouteStats } from '../../entities/route-stats.entity';
import { GeneratedRoute } from './route-generation.service';

@Injectable()
export class RoutesService {
  constructor(
    @InjectRepository(Route) private readonly routesRepo: Repository<Route>,
    @InjectRepository(RouteStats) private readonly statsRepo: Repository<RouteStats>,
  ) {}

  async saveGenerated(params: {
    userId: string;
    bikeId: string;
    preferencesId: string;
    name: string;
    generated: GeneratedRoute;
  }): Promise<Route> {
    const { userId, bikeId, preferencesId, name, generated } = params;
    const coordinates = (generated.geojson.geometry.coordinates as Array<[number, number, number?]>).map(
      ([lon, lat]) => [lon, lat] as [number, number],
    );

    const route = this.routesRepo.create({
      userId,
      bikeId,
      preferencesId,
      name,
      geom: { type: 'LineString', coordinates },
      geojson: generated.geojson,
      distanceM: generated.distanceM,
      durationS: generated.durationS,
      ascentM: generated.ascentM,
      descentM: generated.descentM,
      avgSpeedKmh: generated.avgSpeedKmh,
      pctFlat: generated.quality.pctFlat,
      pctClimb: generated.quality.pctClimb,
      pctDescent: generated.quality.pctDescent,
      pctBikeLane: generated.quality.pctBikeLane,
      pctSecondary: generated.quality.pctSecondary,
      pctDepartmental: generated.quality.pctDepartmental,
      scoreTotal: generated.quality.scoreTotal,
      scoreBreakdown: generated.quality.breakdown,
      starRating: generated.quality.starRating,
      starExplanation: generated.quality.starExplanation,
      pois: generated.pois,
      provider: generated.provider,
    });

    const saved = await this.routesRepo.save(route);
    await this.bumpStats(userId, generated.distanceM, generated.ascentM);
    return saved;
  }

  async findAllForUser(userId: string, favoritesOnly = false): Promise<Route[]> {
    return this.routesRepo.find({
      where: favoritesOnly ? { userId, isFavorite: true } : { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(userId: string, id: string): Promise<Route> {
    const route = await this.routesRepo.findOne({ where: { id, userId } });
    if (!route) throw new NotFoundException('Parcours introuvable.');
    return route;
  }

  async toggleFavorite(userId: string, id: string): Promise<Route> {
    const route = await this.findOne(userId, id);
    route.isFavorite = !route.isFavorite;
    return this.routesRepo.save(route);
  }

  async remove(userId: string, id: string): Promise<void> {
    await this.routesRepo.delete({ id, userId });
  }

  private async bumpStats(userId: string, distanceM: number, ascentM: number): Promise<void> {
    let stats = await this.statsRepo.findOne({ where: { userId } });
    if (!stats) {
      stats = this.statsRepo.create({ userId, totalRoutes: 0, totalDistanceM: 0, totalAscentM: 0 });
    }
    stats.totalRoutes += 1;
    stats.totalDistanceM = Number(stats.totalDistanceM) + distanceM;
    stats.totalAscentM = Number(stats.totalAscentM) + ascentM;
    await this.statsRepo.save(stats);
  }
}
