import { IsBoolean, IsIn, IsOptional, IsString, MaxLength } from 'class-validator';
import { BikeType } from '../../../entities/bike.entity';

export class CreateBikeDto {
  @IsString()
  @MaxLength(120)
  name!: string;

  @IsIn(['road', 'gravel', 'mtb', 'electric', 'city'])
  type!: BikeType;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}
