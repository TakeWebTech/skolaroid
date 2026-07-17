import { IsArray, IsBoolean, IsDateString, IsInt, IsOptional, IsString, IsUUID, Max, MaxLength, Min, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

export class CreateExamDto {
  @IsUUID()
  classId!: string;
  @IsString()
  @MaxLength(160)
  name!: string;
  @IsString()
  @MaxLength(60)
  term!: string;
  @IsString()
  @MaxLength(80)
  subject!: string;
  @IsInt()
  @Min(1)
  @Max(500)
  maxMarks!: number;
  @IsDateString()
  startDate!: string;
  @IsDateString()
  endDate!: string;
}

export class MarkRecordDto {
  @IsUUID()
  studentId!: string;
  @IsOptional()
  @IsInt()
  @Min(0)
  marks?: number;
  @IsBoolean()
  absent!: boolean;
}

export class SaveMarksDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MarkRecordDto)
  records!: MarkRecordDto[];
}
