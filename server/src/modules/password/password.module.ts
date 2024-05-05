import { Module } from "@nestjs/common";
import { PrismaModule } from "nestjs-prisma";
import { PasswordService } from "./password.service";
import { PasswordController } from "./password.controller";

@Module({
    imports: [PrismaModule],
    providers: [PasswordService],
    controllers: [PasswordController]
})
export class PasswordModule {}