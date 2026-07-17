import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class SwitchContextDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  membershipId!: string;
}

