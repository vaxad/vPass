import { ApiProperty } from "@nestjs/swagger";
import { LoginInputDto } from "../dto/login.input.dto";

export class LoginEntity implements LoginInputDto{
    @ApiProperty()
    email: string;
    @ApiProperty()
    password: string;
}