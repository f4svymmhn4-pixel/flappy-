import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../../entities/user.entity';
import { RoutesService } from '../routing/routes.service';

/**
 * Thin convenience endpoint over RoutesService — favoriting itself happens
 * via PATCH /routes/:id/favorite (in RoutingController) so a route's
 * favorite flag stays a single source of truth.
 */
@Controller('favorites')
@UseGuards(JwtAuthGuard)
export class FavoritesController {
  constructor(private readonly routesService: RoutesService) {}

  @Get()
  list(@CurrentUser() user: User) {
    return this.routesService.findAllForUser(user.id, true);
  }
}
