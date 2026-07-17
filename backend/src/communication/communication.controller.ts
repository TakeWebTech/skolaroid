import { Body, Controller, Get, Inject, Param, ParseUUIDPipe, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CurrentUser } from "../auth/current-user";
import { AuthenticatedUser, JwtAuthGuard } from "../auth/jwt-auth.guard";
import { PermissionGuard } from "../auth/permission.guard";
import { RequirePermission } from "../auth/require-permission.decorator";
import { CommunicationService } from "./communication.service";
import { CreateAnnouncementDto, SendMessageDto } from "./communication.dto";

@ApiTags("communication")
@ApiBearerAuth()
@Controller()
@UseGuards(JwtAuthGuard, PermissionGuard)
export class CommunicationController {
  constructor(@Inject(CommunicationService) private readonly communication: CommunicationService) {}

  @Get("messages/threads")
  @RequirePermission("messages.send")
  threads(@CurrentUser() user: AuthenticatedUser) {
    return this.communication.threads(user);
  }

  @Get("messages/threads/:id")
  @RequirePermission("messages.send")
  thread(@CurrentUser() user: AuthenticatedUser, @Param("id", ParseUUIDPipe) id: string) {
    return this.communication.thread(user, id);
  }

  @Post("messages")
  @RequirePermission("messages.send")
  send(@CurrentUser() user: AuthenticatedUser, @Body() dto: SendMessageDto) {
    return this.communication.send(user, dto);
  }

  @Get("announcement/audiences")
  @RequirePermission("announcements.send")
  audiences(@CurrentUser() user: AuthenticatedUser) {
    return this.communication.audiences(user);
  }

  @Get("announcements")
  @RequirePermission("announcements.view")
  announcements(@CurrentUser() user: AuthenticatedUser) {
    return this.communication.announcements(user);
  }

  @Post("announcements")
  @RequirePermission("announcements.send")
  createAnnouncement(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateAnnouncementDto) {
    return this.communication.createAnnouncement(user, dto);
  }

  @Post("announcements/:id/send")
  @RequirePermission("announcements.send")
  sendAnnouncement(@CurrentUser() user: AuthenticatedUser, @Param("id", ParseUUIDPipe) id: string) {
    return this.communication.sendAnnouncement(user, id);
  }
}
