import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UserService } from "../user/user.service";
import { PassportStrategy } from "@nestjs/passport" 
import { ExtractJwt, Strategy } from "passport-jwt"
import { ConfigService } from "@nestjs/config"
import { JwtDto } from "./auth.dto";
import { User } from "@prisma/client";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthStrategy extends PassportStrategy(Strategy){
    constructor(
        private readonly userService: UserService,
        readonly configService: ConfigService,
        private readonly jwtService: JwtService
    ) { 
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get("JWT_SECRET")
        })
    }

    async validate(payload:JwtDto):Promise<User>{
        if(!payload.userId) throw UnauthorizedException;
        const user = this.userService.getUser(payload.userId);
        if(!user) throw UnauthorizedException;
        return user;
    }

    async validateToken(token:string){
        try {
            
        if(!token) return UnauthorizedException;
        const jwt:JwtDto = this.jwtService.verify(token, {
            secret: this.configService.get("JWT_SECRET") 
        });
        if(!jwt) throw UnauthorizedException;
        return this.validate(jwt);
    } catch (error) {
        console.log({error})
        throw UnauthorizedException;
    }
    }
}