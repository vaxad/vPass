import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from "@nestjs/common";
import { PasswordService } from "./password.service";
import { ApiBody, ApiCreatedResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { CreatePasswordDto } from "./dto/create.input.dto";
import { PasswordEntity } from "./entities/password.entity";
import { CreatePasswordEntity } from "./entities/create.entity";
import { JwtGuard } from "../auth/auth.guard";
import { ApplyMiddleware } from "src/utils/applyMiddleware.decorator";
import { User } from "@prisma/client";
import { EditPasswordDto } from "./dto/edit.input.dto";

@Controller("password")
@ApiTags("password")
export class PasswordController{
    constructor(
        private readonly passwordService: PasswordService
    ){}

    @Post()
    @ApiCreatedResponse({type:PasswordEntity})
    @ApiBody({type:CreatePasswordEntity})
    @ApplyMiddleware()
    @UseGuards(JwtGuard)
    create(@Body() payload: CreatePasswordDto, @Req() req:{user:User}){
        return this.passwordService.createPassword(payload, req.user.id)
    }

    @Get()
    @ApplyMiddleware()
    @UseGuards(JwtGuard)
    @ApiOkResponse({type:PasswordEntity, isArray:true})
    getAll(@Req() req:{user:User}){
        return this.passwordService.getAll(req.user.id)
    }

    @Patch(":id")
    @ApplyMiddleware()
    @UseGuards(JwtGuard)
    edit(
        @Req() req:{user:User},
        @Param('id') passId: string,
        @Body() payload: EditPasswordDto
    ){
        return this.passwordService.editPassword(payload,req.user.id, passId)
    }

    @Get(":id")
    @ApplyMiddleware()
    @UseGuards(JwtGuard)
    get(
        @Req() req:{user:User},
        @Param('id') passId: string
    ){
        return this.passwordService.getPassword(req.user.id, passId)
    }

    @Delete(":id")
    @ApplyMiddleware()
    @UseGuards(JwtGuard)
    delete(
        @Req() req:{user:User},
        @Param('id') passId: string
    ){
        return this.passwordService.deletePassword(req.user.id, passId)
    }
    
}