import { Injectable } from '@nestjs/common';
import { MailBody } from './mail.controller';

@Injectable()
export class MailService {
  sendMail(body: MailBody) {
    console.log(body);
    return 'Mail sent';
  }
}
