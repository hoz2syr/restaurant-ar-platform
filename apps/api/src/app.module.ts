import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { AdminModule } from './modules/admin/admin.module';
import { PublicModule } from './modules/public/public.module';
import { OrdersModule } from './modules/orders/orders.module';
import { GlobalExceptionFilter } from './common/filters';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: Number.parseInt(process.env.THROTTLE_TTL ?? '60', 10),
        limit: Number.parseInt(process.env.THROTTLE_LIMIT ?? '120', 10),
      },
    ]),
    AuthModule,
    AdminModule,
    PublicModule,
    OrdersModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
