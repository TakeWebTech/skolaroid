import { IsEmail, IsOptional, IsString, MaxLength } from "class-validator";

export class CreateApplicationDto {
  @IsString() @MaxLength(160) studentName!: string;
  @IsString() @MaxLength(60) grade!: string;
  @IsString() @MaxLength(160) guardianName!: string;
  @IsString() @MaxLength(40) guardianPhone!: string;
  @IsOptional() @IsEmail() guardianEmail?: string;
  @IsOptional() @IsString() @MaxLength(1000) notes?: string;
}

export class DecideApplicationDto {
  @IsOptional() @IsString() @MaxLength(1000) notes?: string;
}
