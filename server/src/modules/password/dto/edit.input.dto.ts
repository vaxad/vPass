import { IsString, IsOptional, IsInt, IsBoolean, IsBooleanString} from "class-validator"

export class EditPasswordDto {
  
  @IsString()
  @IsOptional()
  name: string;
  
  @IsString()
  @IsOptional()
  password: string;
  
  @IsString()
  @IsOptional()
  groupId?: string;
  
  @IsString()
  @IsOptional()
  teamId?: string;
  
  @IsBooleanString()
  @IsOptional()
  public?:string;

  @IsInt()
  @IsOptional()
  views?:number;

}