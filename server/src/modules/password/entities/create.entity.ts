import { ApiProperty } from "@nestjs/swagger";
import { CreatePasswordDto } from "../dto/create.input.dto";

export class CreatePasswordEntity implements CreatePasswordDto{
    @ApiProperty()
    name: string;
    @ApiProperty()
    groupId?: string;
    @ApiProperty()
    password: string;
    @ApiProperty()
    teamId?: string;
}