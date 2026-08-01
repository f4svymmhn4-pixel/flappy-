import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bike, BikeType } from '../../entities/bike.entity';
import { CreateBikeDto } from './dto/bike.dto';

@Injectable()
export class BikesService {
  constructor(@InjectRepository(Bike) private readonly bikesRepo: Repository<Bike>) {}

  findAllForUser(userId: string): Promise<Bike[]> {
    return this.bikesRepo.find({ where: { userId }, order: { createdAt: 'ASC' } });
  }

  async create(userId: string, dto: CreateBikeDto): Promise<Bike> {
    if (dto.isDefault) {
      await this.bikesRepo.update({ userId }, { isDefault: false });
    }
    const bike = this.bikesRepo.create({ ...dto, userId });
    return this.bikesRepo.save(bike);
  }

  remove(userId: string, id: string): Promise<void> {
    return this.bikesRepo.delete({ id, userId }).then(() => undefined);
  }

  /** Resolves the bike to use for a generation request: explicit id, else the user's default, else a transient one. */
  async resolveForGeneration(userId: string, bikeType: BikeType, bikeId?: string): Promise<Bike> {
    if (bikeId) {
      const bike = await this.bikesRepo.findOne({ where: { id: bikeId, userId } });
      if (bike) return bike;
    }
    const defaultBike = await this.bikesRepo.findOne({ where: { userId, isDefault: true } });
    if (defaultBike) return defaultBike;

    return this.create(userId, { name: this.defaultNameFor(bikeType), type: bikeType, isDefault: true });
  }

  private defaultNameFor(type: BikeType): string {
    const labels: Record<BikeType, string> = {
      road: 'Vélo de route',
      gravel: 'Gravel',
      mtb: 'VTT',
      electric: 'Vélo électrique',
      city: 'Vélo de ville',
    };
    return labels[type];
  }
}
