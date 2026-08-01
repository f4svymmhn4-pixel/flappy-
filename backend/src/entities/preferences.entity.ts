import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Bike } from './bike.entity';

export type Difficulty = 'very_easy' | 'easy' | 'medium' | 'sporty' | 'very_sporty';
export type ElevationProfile = 'very_flat' | 'flat' | 'some_hills' | 'rolling' | 'mountain' | 'custom';
export type Priority =
  | 'tourism'
  | 'performance'
  | 'scenery'
  | 'quiet_roads'
  | 'max_bike_lanes'
  | 'climbing'
  | 'descent'
  | 'training'
  | 'leisure';

@Entity('preferences')
export class Preferences {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => User, (user) => user.preferences, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column({ name: 'user_id' })
  userId!: string;

  @ManyToOne(() => Bike, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'bike_id' })
  bike?: Bike;

  @Column({ name: 'bike_id', nullable: true })
  bikeId?: string;

  @Column({ name: 'distance_km', type: 'numeric', precision: 6, scale: 2, default: 40 })
  distanceKm!: number;

  @Column({ name: 'duration_minutes', type: 'int', nullable: true })
  durationMinutes?: number;

  @Column({ type: 'varchar', length: 20, default: 'medium' })
  difficulty!: Difficulty;

  @Column({ name: 'elevation_profile', type: 'varchar', length: 20, default: 'rolling' })
  elevationProfile!: ElevationProfile;

  @Column({ name: 'elevation_custom_m', type: 'int', nullable: true })
  elevationCustomM?: number;

  @Column({ type: 'varchar', length: 30, default: 'scenery' })
  priority!: Priority;

  @Column({ name: 'avoid_gravel', default: false })
  avoidGravel!: boolean;

  @Column({ name: 'avoid_dirt', default: false })
  avoidDirt!: boolean;

  @Column({ name: 'avoid_forest', default: false })
  avoidForest!: boolean;

  @Column({ name: 'avoid_city_center', default: true })
  avoidCityCenter!: boolean;

  @Column({ name: 'avoid_traffic', default: true })
  avoidTraffic!: boolean;

  @Column({ name: 'avoid_trunk_roads', default: true })
  avoidTrunkRoads!: boolean;

  @Column({ name: 'avoid_no_bike_lane', default: false })
  avoidNoBikeLane!: boolean;

  @Column({ name: 'avoid_industrial', default: true })
  avoidIndustrial!: boolean;

  @Column({ name: 'avoid_roadworks', default: true })
  avoidRoadworks!: boolean;

  @Column({ name: 'follow_bike_lanes', default: true })
  followBikeLanes!: boolean;

  @Column({ name: 'prefer_small_roads', default: true })
  preferSmallRoads!: boolean;

  @Column({ name: 'avoid_traffic_lights', default: false })
  avoidTrafficLights!: boolean;

  @Column({ name: 'avoid_stop_signs', default: false })
  avoidStopSigns!: boolean;

  @Column({ name: 'prefer_riverside', default: false })
  preferRiverside!: boolean;

  @Column({ name: 'prefer_vineyards', default: false })
  preferVineyards!: boolean;

  @Column({ name: 'prefer_viewpoints', default: true })
  preferViewpoints!: boolean;

  @Column({ name: 'prefer_lakes', default: false })
  preferLakes!: boolean;

  @Column({ name: 'prefer_ocean', default: false })
  preferOcean!: boolean;

  @Column({ name: 'is_loop', default: true })
  isLoop!: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
