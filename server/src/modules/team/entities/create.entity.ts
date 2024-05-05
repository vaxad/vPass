import { ApiProperty } from "@nestjs/swagger";

export class TeamEntity{
    @ApiProperty()
    name: string;
    @ApiProperty()
    createdAt: Date;
    @ApiProperty()
    id: string;
    @ApiProperty()
    userId: string;
}