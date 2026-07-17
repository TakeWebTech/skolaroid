import { IsOptional, IsString, IsUUID, MaxLength } from "class-validator";

export class CreateStudentDto {
  @IsString()
  @MaxLength(40)
  admissionNo!: string;

  @IsString()
  @MaxLength(160)
  displayName!: string;

  @IsUUID()
  classId!: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  rollNo?: string;
}
