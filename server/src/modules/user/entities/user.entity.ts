import { ApiProperty } from "@nestjs/swagger";
import { User } from "@prisma/client" 

export class UserEntity implements User{
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