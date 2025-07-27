import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Task } from '../schemas/tasks.schema';
import { Model } from 'mongoose';
import { Utils } from 'src/utils/Utils';

@Injectable()
export class TasksService {
  constructor(@InjectModel(Task.name) private taskModel: Model<Task>) {}

  create(createTaskDto: CreateTaskDto) {
    return this.taskModel.create(createTaskDto);
  }

  findAll() {
    return this.taskModel.find();
  }

  findOne(id: string) {
    if (!Utils.isObjectId(id)) {
      throw new BadRequestException('Invalid ObjectId passed as id');
    }

    return this.taskModel.findById(id);
  }

  update(id: string, updateTaskDto: UpdateTaskDto) {
    if (!Utils.isObjectId(id)) {
      throw new BadRequestException('Invalid ObjectId passed as id');
    }

    return this.taskModel.findByIdAndUpdate(id, updateTaskDto);
  }

  remove(id: string) {
    if (!Utils.isObjectId(id)) {
      throw new BadRequestException('Invalid ObjectId passed as id');
    }

    return this.taskModel.findByIdAndDelete(id);
  }
}
