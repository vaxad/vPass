import { ApiProperty } from "@nestjs/swagger";

export class GroupEntity{
    @ApiProperty()
    name: string;
    @ApiProperty()
    createdAt: Date;
    @ApiProperty()
    id: string;
    @ApiProperty()
    userId: string;
}