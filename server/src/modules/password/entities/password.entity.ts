import { ApiProperty } from "@nestjs/swagger";

export class PasswordEntity{
    @ApiProperty()
    name: string;
    @ApiProperty()
    groupId: string;
    @ApiProperty()
    id: string;
    @ApiProperty()
    password: string;
    @ApiProperty()
    teamId: string;
    @ApiProperty()
    userId: string;
    @ApiProperty()
    createdAt: Date;
}