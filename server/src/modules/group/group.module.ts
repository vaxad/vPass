import { Module } from "@nestjs/common";
import { PrismaModule } from "nestjs-prisma";
import { GroupService } from "./group.service";
import { PasswordController } from "./group.controller";

@Module({
    imports: [PrismaModule],
    providers: [GroupService],
    controllers: [PasswordController]
})
export class GroupModule {}