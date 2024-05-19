import {IsNotEmpty, IsOptional, IsString} from "class-validator"

export class CreateGroupDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  teamId: string;

}