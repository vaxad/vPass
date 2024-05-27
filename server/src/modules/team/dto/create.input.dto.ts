import {IsArray, IsNotEmpty, IsOptional, IsString} from "class-validator"

export class CreateTeamDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsArray()
  @IsOptional()
  members?: string[];

}