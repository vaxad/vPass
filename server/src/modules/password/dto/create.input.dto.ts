import {IsBooleanString, IsNotEmpty, IsNumberString, IsOptional, IsString} from "class-validator"

export class CreatePasswordDto {
  
  @IsString()
  @IsNotEmpty()
  name: string;
  
  @IsString()
  @IsNotEmpty()
  password: string;
  
  @IsString()
  @IsOptional()
  groupId?: string;
  
  @IsString()
  @IsOptional()
  teamId?: string;

  @IsBooleanString()
  @IsOptional()
  public?: string;

  @IsNumberString()
  @IsOptional()
  views?:string;

}