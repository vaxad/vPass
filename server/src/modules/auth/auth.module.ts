import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { JwtGuard } from "./auth.guard";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { UserService } from "../user/user.service";
import { AuthStrategy } from "./auth.strategy";

@Module({
    imports:[
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
        })
    ],
    providers: [
        UserService,
        AuthStrategy,
        JwtGuard,
    ],
    exports: [JwtGuard]
})
export class AuthModule { }