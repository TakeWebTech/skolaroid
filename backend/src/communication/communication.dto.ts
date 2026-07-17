import { IsIn, IsString, IsUUID, MaxLength } from "class-validator";

export class SendMessageDto {
  @IsUUID()
  conversationId!: string;
  @IsString()
  @MaxLength(4000)
  body!: string;
}

export class CreateAnnouncementDto {
  @IsString() @MaxLength(160) title!: string;
  @IsString() @MaxLength(4000) body!: string;
  @IsIn(["teacher", "student", "parent", "admin", "all"])
  audienceRole!: string;
}
