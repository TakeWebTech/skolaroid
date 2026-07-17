import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class LoginDto {
  @ApiProperty({ example: "teacher@demoschool.edu" })
  @IsString()
  @IsNotEmpty()
  @MaxLength(320)
  identifier!: string;

  @ApiProperty({ example: "correct horse battery staple" })
  @IsString()
  @IsNotEmpty()
  @MaxLength(256)
  password!: string;
}
