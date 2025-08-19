import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Task } from '../schemas/tasks.schema';
import { Error, Model } from 'mongoose';
import { Utils } from 'src/utils/Utils';
import { User } from 'src/schemas/users.schema';
import { JwtPayload } from 'src/auth/auth.service';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private taskModel: Model<Task>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async create(createTaskDto: CreateTaskDto, user: JwtPayload) {
    if (!user) {
      throw new UnauthorizedException(
        'Owner not found while creating the task',
      );
    }

    try {
      const createdTask = await this.taskModel.create({
        ...createTaskDto,
        owner: user.userId,
      });
      return {
        data: createdTask,
        message: 'Task created successfully',
        success: true,
      };
    } catch (error: unknown) {
      if (error instanceof Error.ValidationError) {
        const validationErrors = Object.values(error.errors).map(
          (err: Error) => err.message,
        );
        throw new BadRequestException({
          success: false,
          message: 'Validation failed',
          errors: validationErrors,
        });
      }

      throw error;
    }
  }

  async findAll() {
    const tasks = await this.taskModel
      .find()
      .populate<{ owner: User }>('owner')
      .populate<{ assignee: User[] }>('assignee');
    return {
      data: tasks,
      message: 'Tasks fetched successfully',
      success: true,
    };
  }

  async findAllUserTasks(user: JwtPayload) {
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const tasks = await this.taskModel
      .find({ assignee: { $in: [user.userId] } })
      .populate<{ owner: User }>('owner')
      .populate<{ assignee: User[] }>('assignee');

    return {
      data: tasks,
      message: 'Tasks fetched successfully',
      success: true,
    };
  }

  async findAllProjectTasks(id: string) {
    if (!Utils.isObjectId(id)) {
      throw new BadRequestException('Invalid ObjectId passed as id');
    }

    const tasks = await this.taskModel
      .find({ project: id })
      .populate<{ owner: User }>('owner')
      .populate<{ assignee: User[] }>('assignee');

    return {
      data: tasks,
      message: 'Tasks fetched successfully',
      success: true,
    };
  }

  async searchTasks(term: string) {
    const tasks = await this.taskModel
      .find({ $text: { $search: term } })
      .populate<{ owner: User }>('owner')
      .populate<{ assignee: User[] }>('assignee');
    return {
      data: tasks,
      message: 'Tasks fetched successfully',
      success: true,
    };
  }

  async findOne(id: string) {
    if (!Utils.isObjectId(id)) {
      throw new BadRequestException('Invalid ObjectId passed as id');
    }

    const task = await this.taskModel.findById(id);

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return {
      data: task,
      message: 'Task fetched successfully',
      success: true,
    };
  }

  async update(id: string, updateTaskDto: UpdateTaskDto) {
    if (!Utils.isObjectId(id)) {
      throw new BadRequestException('Invalid ObjectId passed as id');
    }

    try {
      const updatedTask = await this.taskModel.findByIdAndUpdate(
        id,
        updateTaskDto,
        { runValidators: true, new: true },
      );

      if (!updatedTask) {
        throw new NotFoundException('Task not found');
      }

      return {
        data: updatedTask,
        message: 'Task updated successfully',
        success: true,
      };
    } catch (error: unknown) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      if (error instanceof Error.ValidationError) {
        const validationErrors = Object.values(error.errors).map(
          (err: Error) => err.message,
        );
        throw new BadRequestException({
          success: false,
          message: 'Validation failed',
          errors: validationErrors,
        });
      }

      console.error('Unexpected error in update task:', error);
      throw new InternalServerErrorException('An unexpected error occurred');
    }
  }

  async assignTask(id: string, userId: string) {
    if (!Utils.isObjectId(id)) {
      throw new BadRequestException('Invalid ObjectId passed as id');
    }

    if (!Utils.isObjectId(userId)) {
      throw new BadRequestException('Invalid ObjectId passed as userId');
    }

    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const task = await this.taskModel.findByIdAndUpdate(
      id,
      {
        $addToSet: {
          assignee: userId,
        },
      },
      { new: true },
    );

    return {
      data: task,
      message: 'Task assigned successfully',
      success: true,
    };
  }

  async removeAssignee(id: string, userId: string) {
    if (!Utils.isObjectId(id)) {
      throw new BadRequestException('Invalid ObjectId passed as id');
    }

    if (!Utils.isObjectId(userId)) {
      throw new BadRequestException('Invalid ObjectId passed as userId');
    }

    const task = await this.taskModel.findByIdAndUpdate(
      id,
      {
        $pull: {
          assignee: userId,
        },
      },
      { new: true },
    );

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return {
      data: task,
      message: 'Assignee removed successfully',
      success: true,
    };
  }

  async remove(id: string) {
    if (!Utils.isObjectId(id)) {
      throw new BadRequestException('Invalid ObjectId passed as id');
    }

    const deletedTask = await this.taskModel.findByIdAndDelete(id);

    if (!deletedTask) {
      throw new NotFoundException('Task not found');
    }

    return {
      data: deletedTask,
      message: 'Task deleted successfully',
      success: true,
    };
  }

  async removeProjectTasks(projectId: string) {
    if (!Utils.isObjectId(projectId)) {
      throw new BadRequestException('Invalid ObjectId passed as projectId');
    }

    const tasks = await this.taskModel.deleteMany({ project: projectId });

    return {
      data: tasks,
      message: 'Tasks deleted successfully',
      success: true,
    };
  }
}
