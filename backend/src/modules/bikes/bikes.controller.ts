import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../../entities/user.entity';
import { BikesService } from './bikes.service';
import { CreateBikeDto } from './dto/bike.dto';

@Controller('bikes')
@UseGuards(JwtAuthGuard)
export class BikesController {
  constructor(private readonly bikesService: BikesService) {}

  @Get()
  findAll(@CurrentUser() user: User) {
    return this.bikesService.findAllForUser(user.id);
  }

  @Post()
  create(@CurrentUser() user: User, @Body() dto: CreateBikeDto) {
    return this.bikesService.create(user.id, dto);
  }

  @Delete(':id')
  remove(@CurrentUser() user: User, @Param('id') id: string) {
    return this.bikesService.remove(user.id, id);
  }
}
