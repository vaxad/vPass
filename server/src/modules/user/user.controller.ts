import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
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
        return {user:req.user, success:true}
    }
    
}