import { IsString, IsOptional} from "class-validator"

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
}