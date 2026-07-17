import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsIn, IsInt, IsOptional, IsString, IsUUID, Max, MaxLength, Min } from "class-validator";

export const submissionTypes = ["text", "file", "offline"] as const;
export type SubmissionType = typeof submissionTypes[number];

export class CreateAssignmentDto {
  @IsUUID()
  classId!: string;

  @IsString()
  @MaxLength(160)
  title!: string;

  @IsString()
  @MaxLength(80)
  subject!: string;

  @IsString()
  @MaxLength(4000)
  instructions!: string;

  @ApiProperty({ example: "2026-07-20T18:00:00.000Z" })
  @IsDateString()
  dueAt!: string;

  @IsInt()
  @Min(1)
  @Max(500)
  totalMarks!: number;

  @IsIn(submissionTypes)
  submissionType!: SubmissionType;
}

export class SubmitAssignmentDto {
  @IsString()
  @MaxLength(4000)
  responseText!: string;
}

export class GradeSubmissionDto {
  @IsInt()
  @Min(0)
  marksAwarded!: number;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  feedback?: string;
}
