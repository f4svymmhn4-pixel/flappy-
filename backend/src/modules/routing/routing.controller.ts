import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import type { Feature, LineString } from 'geojson';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../../entities/user.entity';
import { GenerateRouteDto } from './dto/generate-route.dto';
import { RouteGenerationService } from './route-generation.service';
import { RoutesService } from './routes.service';
import { BikesService } from '../bikes/bikes.service';
import { PreferencesService } from '../preferences/preferences.service';
import { GeocodingService } from './geocoding.service';
import { ExportService, ExportFormat } from '../export/export.service';

const EXPORT_FORMATS: ExportFormat[] = ['gpx', 'tcx', 'kml', 'geojson', 'fit'];

@Controller('routes')
@UseGuards(JwtAuthGuard)
export class RoutingController {
  constructor(
    private readonly routeGenerationService: RouteGenerationService,
    private readonly routesService: RoutesService,
    private readonly bikesService: BikesService,
    private readonly preferencesService: PreferencesService,
    private readonly geocodingService: GeocodingService,
    private readonly exportService: ExportService,
  ) {}

  @Post('generate')
  async generate(@CurrentUser() user: User, @Body() dto: GenerateRouteDto) {
    const start = await this.resolveStart(user, dto);

    const bike = await this.bikesService.resolveForGeneration(user.id, dto.bikeType, dto.bikeId);
    const preferences = await this.preferencesService.saveFromGenerateDto(user.id, bike.id, dto);

    const generated = await this.routeGenerationService.generate({
      start,
      bikeType: dto.bikeType,
      preferences,
      isLoop: dto.isLoop ?? true,
    });

    const name = `${dto.isLoop === false ? 'Sortie' : 'Boucle'} ${dto.distanceKm}km - ${bike.name}`;
    return this.routesService.saveGenerated({
      userId: user.id,
      bikeId: bike.id,
      preferencesId: preferences.id,
      name,
      generated,
    });
  }

  @Get()
  findAll(@CurrentUser() user: User, @Query('favorites') favorites?: string) {
    return this.routesService.findAllForUser(user.id, favorites === 'true');
  }

  @Get(':id')
  findOne(@CurrentUser() user: User, @Param('id') id: string) {
    return this.routesService.findOne(user.id, id);
  }

  @Patch(':id/favorite')
  toggleFavorite(@CurrentUser() user: User, @Param('id') id: string) {
    return this.routesService.toggleFavorite(user.id, id);
  }

  @Delete(':id')
  async remove(@CurrentUser() user: User, @Param('id') id: string) {
    await this.routesService.remove(user.id, id);
    return { success: true };
  }

  @Get(':id/deeplinks')
  async deepLinks(@CurrentUser() user: User, @Param('id') id: string) {
    const route = await this.routesService.findOne(user.id, id);
    return this.exportService.deepLinks(route.geojson as Feature<LineString>);
  }

  @Get(':id/export/:format')
  async export(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Param('format') format: string,
    @Res() res: Response,
  ) {
    if (!EXPORT_FORMATS.includes(format as ExportFormat)) {
      throw new BadRequestException(`Format d'export inconnu: ${format}`);
    }
    const route = await this.routesService.findOne(user.id, id);
    const result = this.exportService.export(
      format as ExportFormat,
      route.name,
      route.geojson as Feature<LineString>,
      route.distanceM,
    );
    res.setHeader('Content-Type', result.contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"`);
    res.send(result.body);
  }

  private async resolveStart(user: User, dto: GenerateRouteDto) {
    if (dto.start.lat !== undefined && dto.start.lon !== undefined) {
      return { lat: dto.start.lat, lon: dto.start.lon };
    }
    const address = dto.start.address ?? user.defaultAddress;
    const geocoded = await this.geocodingService.geocode(address);
    if (geocoded) return geocoded;
    // Last resort: the user's stored default coordinates (pre-seeded to the
    // 29 Avenue François Mitterrand, Mérignac address at signup).
    return { lat: user.defaultLat, lon: user.defaultLon };
  }
}
