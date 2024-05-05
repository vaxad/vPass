import { Module } from "@nestjs/common";
import { PrismaModule } from "nestjs-prisma";
import { TeamService } from "./team.service";
import { PasswordController } from "./team.controller";

@Module({
    imports: [PrismaModule],
    providers: [TeamService],
    controllers: [PasswordController]
})
export class TeamModule {}