import { IsIn, IsLatitude, IsLongitude, IsOptional, IsString } from 'class-validator';
import { Theme } from '../../../entities/user.entity';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  displayName?: string;

  @IsOptional()
  @IsString()
  defaultAddress?: string;

  @IsOptional()
  @IsLatitude()
  defaultLat?: number;

  @IsOptional()
  @IsLongitude()
  defaultLon?: number;

  @IsOptional()
  @IsIn(['light', 'dark', 'system'])
  theme?: Theme;
}
