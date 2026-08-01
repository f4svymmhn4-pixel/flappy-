import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Bike } from './bike.entity';
import { Route } from './route.entity';
import { Preferences } from './preferences.entity';

export type Theme = 'light' | 'dark' | 'system';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ name: 'password_hash', nullable: true })
  passwordHash?: string;

  @Column({ name: 'display_name', nullable: true })
  displayName?: string;

  @Column({
    name: 'default_address',
    default: '29 Avenue François Mitterrand, 33700 Mérignac, France',
  })
  defaultAddress!: string;

  @Column({ name: 'default_lat', type: 'double precision', default: 44.8378 })
  defaultLat!: number;

  @Column({ name: 'default_lon', type: 'double precision', default: -0.6506 })
  defaultLon!: number;

  @Column({ type: 'varchar', length: 10, default: 'system' })
  theme!: Theme;

  @OneToMany(() => Bike, (bike) => bike.user)
  bikes?: Bike[];

  @OneToMany(() => Route, (route) => route.user)
  routes?: Route[];

  @OneToMany(() => Preferences, (prefs) => prefs.user)
  preferences?: Preferences[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
