import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from "@nestjs/common";
import { TeamService } from "./team.service";
import { ApiBody, ApiCreatedResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { CreateTeamDto } from "./dto/create.input.dto";
import { TeamEntity } from "./entities/create.entity";
import { JwtGuard } from "../auth/auth.guard";
import { ApplyMiddleware } from "src/utils/applyMiddleware.decorator";
import { User } from "@prisma/client";

@Controller("team")
@ApiTags("team")
export class PasswordController{
    constructor(
        private readonly teamService: TeamService
    ){}

    @Post()
    @ApiCreatedResponse({type:TeamEntity})
    @ApiBody({type:CreateTeamDto})
    @ApplyMiddleware()
    @UseGuards(JwtGuard)
    create(@Body() payload: CreateTeamDto, @Req() req:{user:User}){
        return this.teamService.createTeam(payload, req.user.id)
    }

    @Get()
    @ApplyMiddleware()
    @UseGuards(JwtGuard)
    @ApiOkResponse({type:TeamEntity, isArray:true})
    getAll(@Req() req:{user:User}){
        return this.teamService.getAll(req.user.id)
    }

    @Patch(":id")
    @ApplyMiddleware()
    @UseGuards(JwtGuard)
    edit(
        @Req() req:{user:User},
        @Param('id') teamId: string,
        @Body() payload: CreateTeamDto
    ){
        return this.teamService.editTeam(payload,req.user.id, teamId)
    }

    @Get(":id")
    @ApplyMiddleware()
    @UseGuards(JwtGuard)
    get(
        @Req() req:{user:User},
        @Param('id') teamId: string
    ){
        return this.teamService.getTeam(req.user.id, teamId)
    }

    @Delete(":id")
    @ApplyMiddleware()
    @UseGuards(JwtGuard)
    delete(
        @Req() req:{user:User},
        @Param('id') teamId: string
    ){
        return this.teamService.deleteTeam(req.user.id, teamId)
    }
    
}