import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import type { Feature, LineString } from 'geojson';
import { User } from './user.entity';
import { Bike } from './bike.entity';
import { Preferences } from './preferences.entity';
import type { ScoreBreakdown } from '../modules/routing/scoring/scoring.types';
import type { RoutePoi } from '../modules/poi/poi.types';

@Entity('routes')
export class Route {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => User, (user) => user.routes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column({ name: 'user_id' })
  userId!: string;

  @ManyToOne(() => Bike, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'bike_id' })
  bike?: Bike;

  @Column({ name: 'bike_id', nullable: true })
  bikeId?: string;

  @ManyToOne(() => Preferences, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'preferences_id' })
  preferences?: Preferences;

  @Column({ name: 'preferences_id', nullable: true })
  preferencesId?: string;

  @Column({ length: 160 })
  name!: string;

  // Assign a GeoJSON-like { type: 'LineString', coordinates } object; TypeORM's
  // Postgres driver wraps it in ST_GeomFromGeoJSON(...) automatically for
  // spatial indexing/queries. The full route (with score/extras) lives in
  // `geojson` below — this column exists for PostGIS spatial queries.
  @Column({
    type: 'geometry',
    spatialFeatureType: 'LineString',
    srid: 4326,
  })
  geom!: LineString;

  @Column({ type: 'jsonb' })
  geojson!: Feature;

  @Column({ name: 'distance_m', type: 'int' })
  distanceM!: number;

  @Column({ name: 'duration_s', type: 'int' })
  durationS!: number;

  @Column({ name: 'ascent_m', type: 'int', default: 0 })
  ascentM!: number;

  @Column({ name: 'descent_m', type: 'int', default: 0 })
  descentM!: number;

  @Column({ name: 'avg_speed_kmh', type: 'numeric', precision: 5, scale: 2, nullable: true })
  avgSpeedKmh?: number;

  @Column({ name: 'pct_flat', type: 'numeric', precision: 5, scale: 2, nullable: true })
  pctFlat?: number;

  @Column({ name: 'pct_climb', type: 'numeric', precision: 5, scale: 2, nullable: true })
  pctClimb?: number;

  @Column({ name: 'pct_descent', type: 'numeric', precision: 5, scale: 2, nullable: true })
  pctDescent?: number;

  @Column({ name: 'pct_bike_lane', type: 'numeric', precision: 5, scale: 2, nullable: true })
  pctBikeLane?: number;

  @Column({ name: 'pct_secondary', type: 'numeric', precision: 5, scale: 2, nullable: true })
  pctSecondary?: number;

  @Column({ name: 'pct_departmental', type: 'numeric', precision: 5, scale: 2, nullable: true })
  pctDepartmental?: number;

  @Column({ name: 'score_total', type: 'numeric', precision: 5, scale: 2, nullable: true })
  scoreTotal?: number;

  @Column({ name: 'score_breakdown', type: 'jsonb', nullable: true })
  scoreBreakdown?: ScoreBreakdown;

  @Column({ name: 'star_rating', type: 'numeric', precision: 2, scale: 1, nullable: true })
  starRating?: number;

  @Column({ name: 'star_explanation', type: 'text', nullable: true })
  starExplanation?: string;

  @Column({ type: 'jsonb', nullable: true })
  pois?: RoutePoi[];

  @Column({ type: 'varchar', length: 20, default: 'openrouteservice' })
  provider!: string;

  @Column({ name: 'is_favorite', default: false })
  isFavorite!: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
