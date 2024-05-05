import { Module } from "@nestjs/common";
import { PrismaModule } from "nestjs-prisma";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

@Module({
    imports: [
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
        PrismaModule],
    providers: [UserService],
    controllers: [UserController]
})
export class UserModule {}