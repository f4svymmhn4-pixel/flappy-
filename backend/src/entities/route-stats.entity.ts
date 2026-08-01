import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('route_stats')
export class RouteStats {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column({ name: 'user_id' })
  userId!: string;

  @Column({ name: 'total_routes', type: 'int', default: 0 })
  totalRoutes!: number;

  @Column({ name: 'total_distance_m', type: 'bigint', default: 0 })
  totalDistanceM!: number;

  @Column({ name: 'total_ascent_m', type: 'bigint', default: 0 })
  totalAscentM!: number;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
