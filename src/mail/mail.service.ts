import { MailerService } from '@nestjs-modules/mailer';
import {
  BadGatewayException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from 'src/schemas/users.schema';
import { Task } from 'src/schemas/tasks.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Task.name) private taskModel: Model<Task>,
  ) {}

  async sendTaskReminderMail({
    userId,
    taskId,
  }: {
    userId: string;
    taskId: string;
  }) {
    const [user, task] = await Promise.all([
      this.userModel.findById(userId),
      this.taskModel.findById(taskId),
    ]);

    if (!user || !task) {
      throw new NotFoundException('User or task not found');
    }

    try {
      await this.mailerService.sendMail({
        to: user.email,
        // from: '"Support Team" <support@example.com>', // override default from
        subject: 'Task Reminder',
        template: './task-reminder',
        context: {
          name: user.name,
          taskId: task._id.toString(),
          taskName: task.title,
          taskDescription: task.description,
          dueDate: task.dueDate.toISOString(),
          priority: task.priority,
          taskUrl: `https://crazy-task-manager.vercel.app/tasks/${task._id.toString()}`,
        },
      });
    } catch (error) {
      console.error(error);
      throw new BadGatewayException('Failed to send task reminder mail');
    }

    return {
      message: 'Task reminder mail sent successfully',
      success: true,
    };
  }
}
