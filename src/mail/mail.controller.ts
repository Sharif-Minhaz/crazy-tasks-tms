import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { MailService } from './mail.service';
import { AdminGuard } from 'src/guards/admin.guard';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { sendMailBodySchema } from './dto/send-mail.dto';
import { ZodValidationPipe } from 'src/pipes/zodValidationPipe';
import { SendMailBody } from './dto/send-mail.dto';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @HttpCode(HttpStatus.OK)
  @Post('task-reminder')
  @UseGuards(JwtAuthGuard, AdminGuard)
  sendTaskReminderMail(
    @Body(new ZodValidationPipe(sendMailBodySchema)) body: SendMailBody,
  ) {
    return this.mailService.sendTaskReminderMail(body);
  }
}
