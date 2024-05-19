import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from "@nestjs/common";
import { GroupService } from "./group.service";
import { ApiBody, ApiCreatedResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { CreateGroupDto } from "./dto/create.input.dto";
import { GroupEntity } from "./entities/create.entity";
import { JwtGuard } from "../auth/auth.guard";
import { ApplyMiddleware } from "src/utils/applyMiddleware.decorator";
import { User } from "@prisma/client";

@Controller("group")
@ApiTags("group")
export class PasswordController{
    constructor(
        private readonly groupService: GroupService
    ){}

    @Post()
    @ApiCreatedResponse({type:GroupEntity})
    @ApiBody({type:CreateGroupDto})
    @ApplyMiddleware()
    @UseGuards(JwtGuard)
    create(@Body() payload: CreateGroupDto, @Req() req:{user:User}){
        return this.groupService.createGroup(payload.name, req.user.id, payload.teamId )
    }

    @Get()
    @ApplyMiddleware()
    @UseGuards(JwtGuard)
    @ApiOkResponse({type:GroupEntity, isArray:true})
    getAll(@Req() req:{user:User}){
        return this.groupService.getAll(req.user.id)
    }

    @Patch(":id")
    @ApplyMiddleware()
    @UseGuards(JwtGuard)
    edit(
        @Req() req:{user:User},
        @Param('id') groupId: string,
        @Body() payload: CreateGroupDto
    ){
        return this.groupService.editGroup(payload,req.user.id, groupId)
    }

    @Get(":id")
    @ApplyMiddleware()
    @UseGuards(JwtGuard)
    get(
        @Req() req:{user:User},
        @Param('id') groupId: string
    ){
        return this.groupService.getGroup(req.user.id, groupId)
    }

    @Get(":id/passwords")
    @ApplyMiddleware()
    @UseGuards(JwtGuard)
    getPasswords(
        @Req() req:{user:User},
        @Param('id') groupId: string
    ){
        return this.groupService.getAllPass(req.user.id, groupId)
    }

    @Delete(":id")
    @ApplyMiddleware()
    @UseGuards(JwtGuard)
    delete(
        @Req() req:{user:User},
        @Param('id') groupId: string
    ){
        return this.groupService.deleteGroup(req.user.id, groupId)
    }

    @Patch(":id/add/:team")
    @ApplyMiddleware()
    @UseGuards(JwtGuard)
    addTeam(
        @Req() req:{user:User},
        @Param('id') groupId: string,
        @Param('team') teamId: string
    ){
        return this.groupService.addToTeam(req.user.id, groupId, teamId)
    }

    @Patch(":id/remove/:team")
    @ApplyMiddleware()
    @UseGuards(JwtGuard)
    removeTeam(
        @Req() req:{user:User},
        @Param('id') groupId: string,
        @Param('team') teamId: string
    ){
        return this.groupService.subFromTeam(req.user.id, groupId, teamId)
    }
    
}