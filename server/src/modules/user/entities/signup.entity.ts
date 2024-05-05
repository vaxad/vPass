import { ApiProperty } from "@nestjs/swagger";
import { SignupInputDto } from "../dto/signup.input.dto";

export class SignupEntity implements SignupInputDto{
    @ApiProperty()
    email: string;
    @ApiProperty()
    password: string;
    @ApiProperty()
    username: string;
}