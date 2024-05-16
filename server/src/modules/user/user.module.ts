import { Module } from "@nestjs/common";
import { PrismaModule } from "nestjs-prisma";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import {MailerModule} from "@nestjs-modules/mailer"

@Module({
    imports: [
        ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
        PassportModule.register({defaultStrategy:"jwt"}),
        JwtModule.registerAsync({
            useFactory: async (configService:ConfigService) => {
                return {
                    secret:configService.get("JWT_SECRET"),
                    signOptions:{
                        expiresIn:"1d"
                    }
                }
            },
            inject: [ConfigService]
        }),    
        MailerModule.forRoot({
            transport: {
            service:"gmail",
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD,
            },
            },
        }),
        PrismaModule],
    providers: [UserService],
    controllers: [UserController]
})
export class UserModule {}