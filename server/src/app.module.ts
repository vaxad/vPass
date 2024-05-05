import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule, loggingMiddleware } from 'nestjs-prisma';
import { UserModule } from './modules/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { PasswordModule } from './modules/password/password.module';
import { TeamModule } from './modules/team/team.module';
import { GroupModule } from './modules/group/group.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true}),
    PrismaModule.forRoot({
      isGlobal: true,
      prismaServiceOptions: {
        middlewares: [
          loggingMiddleware({
            logger: new Logger('PrismaMiddleware'),
            logLevel: 'log',
          }),
        ],
      },
    }),
    PrismaModule,
    UserModule,
    AuthModule,
    PasswordModule,
    TeamModule,
    GroupModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
