import { IsOptional, IsString, MaxLength } from "class-validator";

export class CreateAcademicClassDto {
  @IsString()
  @MaxLength(20)
  code!: string;

  @IsString()
  @MaxLength(120)
  name!: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  subject?: string;

  @IsOptional()
  @IsString()
  @MaxLength(40)
  room?: string;
}
