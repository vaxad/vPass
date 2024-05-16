import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { ApiBody, ApiCreatedResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { SignupInputDto } from "./dto/signup.input.dto";
import { UserEntity } from "./entities/user.entity";
import { SignupEntity } from "./entities/signup.entity";
import { JwtGuard } from "../auth/auth.guard";
import { LoginEntity } from "./entities/login.entity";
import { ApplyMiddleware } from "src/utils/applyMiddleware.decorator";
import { User } from "@prisma/client";

@Controller("user")
@ApiTags("user")
export class UserController{
    constructor(
        private readonly userService: UserService
    ){}

    @Post("signup")
    @ApiCreatedResponse({type:UserEntity})
    @ApiBody({type:SignupEntity})
    create(@Body() payload: SignupInputDto){
        return this.userService.createUser(payload)
    }

    @Get()
    @ApiOkResponse({type:UserEntity, isArray:true})
    getAll(){
        return this.userService.getAll()
    }

    @Post("login")
    @ApiCreatedResponse({type:UserEntity})
    @ApiBody({type:LoginEntity})
    login(@Body() payload: LoginEntity){
        return this.userService.login(payload.email, payload.password)
    }

    @Get("me")
    @ApplyMiddleware()
    @UseGuards(JwtGuard)
    getMe(
        @Req() req:{user:User}
    ){
        return this.userService.getMe(req.user.id)
    }

    @Get(":id")
    @ApplyMiddleware()
    @UseGuards(JwtGuard)
    getUser(
        @Req() req:{user:User},
        @Param("id") userId:string
    ){
        return this.userService.getUser(userId)
    }

    @Patch("resend")
    @ApplyMiddleware()
    @UseGuards(JwtGuard)
    resendOTP(
        @Req() req:{user:User},
    ){
        return this.userService.resendOTP(req.user.id)
    }

    @Patch("verify")
    @ApplyMiddleware()
    @UseGuards(JwtGuard)
    verifyUser(
        @Req() req:{user:User},
        @Body() payload: {otp:string}
    ){
        return this.userService.verifyUser(req.user.id, payload.otp)
    }

    @Patch(":id/invite/:team")
    @ApplyMiddleware()
    @UseGuards(JwtGuard)
    reqJoinTeam(
        @Req() req:{user:User},
        @Param("id") userId:string,
        @Param("team") teamId:string
    ){
        return this.userService.reqJoinTeam(teamId, req.user.id, userId)
    }
    
    @Patch("join/:id")
    @ApplyMiddleware()
    @UseGuards(JwtGuard)
    joinTeam(
        @Req() req:{user:User},
        @Param("id") teamId:string
    ){
        return this.userService.joinTeam(teamId,req.user.id)
    }

    @Patch("reject/:id")
    @ApplyMiddleware()
    @UseGuards(JwtGuard)
    rejectTeam(
        @Req() req:{user:User},
        @Param("id") teamId:string
    ){
        return this.userService.rejectTeam(teamId,req.user.id)
    }

    

}