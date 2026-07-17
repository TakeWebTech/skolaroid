import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsDateString, IsIn, IsOptional, IsString, IsUUID, MaxLength, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

export const attendanceStatuses = ["present", "absent", "late", "leave"] as const;
export type AttendanceMarkStatus = typeof attendanceStatuses[number];

export class CreateAttendanceSessionDto {
  @ApiProperty({ example: "2026-07-15" })
  @IsDateString()
  date!: string;
}

export class AttendanceRecordDto {
  @ApiProperty()
  @IsUUID()
  studentId!: string;

  @ApiProperty({ enum: attendanceStatuses })
  @IsIn(attendanceStatuses)
  status!: AttendanceMarkStatus;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  note?: string;
}

export class SaveAttendanceDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AttendanceRecordDto)
  records!: AttendanceRecordDto[];
}

