import {IsBoolean, IsIn, IsOptional, IsPositive, IsString, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, registerDecorator} from "class-validator"

@ValidatorConstraint({ async: false })
class IsPositiveOrZeroConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    return typeof value === 'number' && value >= 0;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Value must be a positive number or zero';
  }
}

function IsPositiveOrZero(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsPositiveOrZeroConstraint,
    });
  };
}

export class PasswordQueryParamsDto {
  
  @IsString()
  @IsOptional()
  groupId: string = "";
  
  @IsString()
  @IsOptional()
  teamId: string = "";

  @IsPositive()
  @IsOptional()
  limit: number = 15;
  
  @IsPositiveOrZero()
  @IsOptional()
  offset: number = 0;
  
  @IsIn(["name","date"])
  @IsOptional()
  orderBy: string = "name";

  @IsBoolean()
  @IsOptional()
  isPublic: boolean = false;

  constructor() {
    this.groupId= ""
    this.teamId = ""
    this.limit = 15;
    this.offset = 0;
    this.orderBy = "name";
    this.isPublic = false;
  }
}