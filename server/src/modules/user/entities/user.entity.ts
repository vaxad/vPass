import { ApiProperty } from "@nestjs/swagger";

export class UserEntity{
    @ApiProperty()
    createdAt: Date;
    @ApiProperty()
    email: string;
    @ApiProperty()
    id: string;
    @ApiProperty()
    password: string;
    @ApiProperty()
    salt: string;
    @ApiProperty()
    username: string;
}