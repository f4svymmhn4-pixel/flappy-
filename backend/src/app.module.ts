import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import configuration from './config/configuration';
import { User } from './entities/user.entity';
import { Bike } from './entities/bike.entity';
import { Preferences } from './entities/preferences.entity';
import { Route } from './entities/route.entity';
import { RouteStats } from './entities/route-stats.entity';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { BikesModule } from './modules/bikes/bikes.module';
import { PreferencesModule } from './modules/preferences/preferences.module';
import { RoutingModule } from './modules/routing/routing.module';
import { FavoritesModule } from './modules/favorites/favorites.module';
import { ExportModule } from './modules/export/export.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 120 }]),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('database.host'),
        port: config.get('database.port'),
        username: config.get('database.username'),
        password: config.get('database.password'),
        database: config.get('database.name'),
        entities: [User, Bike, Preferences, Route, RouteStats],
        // Schema is owned by database/init/*.sql (mounted into the Postgres
        // container's docker-entrypoint-initdb.d). Keeping synchronize off
        // avoids TypeORM fighting the PostGIS geometry column definitions.
        synchronize: false,
        autoLoadEntities: true,
      }),
    }),
    AuthModule,
    UsersModule,
    BikesModule,
    PreferencesModule,
    RoutingModule,
    FavoritesModule,
    ExportModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
