import { Types } from 'mongoose';
import { BadRequestException } from '@nestjs/common';

export class Utils {
  static parseObjectId(id: string): Types.ObjectId {
    if (!this.isObjectId(id)) {
      throw new BadRequestException('Invalid ObjectId passed as id');
    }
    return new Types.ObjectId(id);
  }

  static isObjectId(id: string): boolean {
    return Types.ObjectId.isValid(id);
  }

  static formatDate(date: Date): string {
    if (!date) return '';

    const formatter = new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    return formatter.format(date);
  }
}
