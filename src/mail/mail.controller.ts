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
import { sendMailSchema } from './dto/send-mail.dto';
import { ZodValidationPipe } from 'src/pipes/zodValidationPipe';

export type MailBody = {
  email: string;
  subject: string;
  html: string;
};

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @HttpCode(HttpStatus.OK)
  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  sendMail(@Body(new ZodValidationPipe(sendMailSchema)) body: MailBody) {
    return this.mailService.sendMail(body);
  }
}
