import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
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
    
    @Get("all")
    @ApplyMiddleware()
    @UseGuards(JwtGuard)
    @ApiOkResponse({type:PasswordEntity, isArray:true})
    getAllGeneral(@Req() req:{user:User}, @Query() query: any){
        const passwordQueryParams = {
            ...query,
            limit: query.limit ? parseInt(query.limit, 10) : 15,
            offset: query.offset ? parseInt(query.offset, 10) : 0,
            isPublic: query.isPublic ? query.isPublic === 'true' : false,
          };
        return this.passwordService.getAllGeneral({userId:req.user.id, passwordQueryParams})
    }

    @Get("my")
    @ApplyMiddleware()
    @UseGuards(JwtGuard)
    @ApiOkResponse({type:PasswordEntity, isArray:true})
    getAllMy(@Req() req:{user:User}){
        return this.passwordService.getAllMy(req.user.id)
    }

    @Get("test")
    test(@Body() payload:{input:string}){
        return this.passwordService.test(payload.input)
    }

    @Patch(":id")
    @ApplyMiddleware()
    @UseGuards(JwtGuard)
    edit(
        @Req() req:{user:User},
        @Param('id') passId: string,
        @Body() payload: CreatePasswordDto
    ){
        return this.passwordService.editPassword(payload,req.user.id, passId)
    }
    
    @Patch(":id/join/:team")
    @ApplyMiddleware()
    @UseGuards(JwtGuard)
    addTeam(
        @Req() req:{user:User},
        @Param('id') passId: string,
        @Param('team') teamId: string
    ){
        return this.passwordService.addToTeam(teamId, passId, req.user.id)
    }
    
    @Patch(":id/remove/:team")
    @ApplyMiddleware()
    @UseGuards(JwtGuard)
    subTeam(
        @Req() req:{user:User},
        @Param('id') passId: string,
        @Param('team') teamId: string
    ){
        return this.passwordService.subFromTeam(teamId, passId, req.user.id)
    }

    @Patch(":id/group/:group")
    @ApplyMiddleware()
    @UseGuards(JwtGuard)
    addGroup(
        @Req() req:{user:User},
        @Param('id') passId: string,
        @Param('group') groupId: string
    ){
        return this.passwordService.addToGroup(groupId, passId, req.user.id)
    }

    @Patch(":id/degroup/:group")
    @ApplyMiddleware()
    @UseGuards(JwtGuard)
    deGroup(
        @Req() req:{user:User},
        @Param('id') passId: string,
        @Param('group') groupId: string
    ){
        return this.passwordService.subFromGroup(groupId, passId, req.user.id)
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

    @Get("search/:term")
    @ApplyMiddleware()
    @UseGuards(JwtGuard)
    search(
        @Req() req:{user:User},
        @Param('term') searchTerm: string
    ){
        return this.passwordService.searchPassword({userId:req.user.id, searchTerm})
    }

    @Get("public/:id")
    getPublic(
        @Param('id') passId: string
    ){
        return this.passwordService.getPublicPassword(passId)
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