import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto, createTaskSchema } from './dto/create-task.dto';
import { UpdateTaskDto, updateTaskSchema } from './dto/update-task.dto';
import { ZodValidationPipe } from '../pipes/zodValidationPipe';
import { AdminGuard } from 'src/guards/admin.guard';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { JwtPayload } from 'src/auth/auth.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  create(
    @Req() req: { user: JwtPayload },
    @Body(new ZodValidationPipe(createTaskSchema)) createTaskDto: CreateTaskDto,
  ) {
    return this.tasksService.create(createTaskDto, req.user);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.tasksService.findAll();
  }

  @Get('user')
  @UseGuards(JwtAuthGuard)
  findAllUserTasks(@Req() req: { user: JwtPayload }) {
    return this.tasksService.findAllUserTasks(req.user);
  }

  @Get('project/:id')
  @UseGuards(JwtAuthGuard)
  findAllProjectTasks(@Param('id') id: string) {
    return this.tasksService.findAllProjectTasks(id);
  }

  @Get('search')
  @UseGuards(JwtAuthGuard)
  searchTasks(@Query('term') term: string) {
    return this.tasksService.searchTasks(term);
  }

  @Patch('assign')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async assignTask(
    @Query('taskId') taskId: string,
    @Query('userId') userId: string,
  ) {
    return await this.tasksService.assignTask(taskId, userId);
  }

  @Patch('remove-assignee')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async removeAssignee(
    @Query('taskId') taskId: string,
    @Query('userId') userId: string,
  ) {
    return await this.tasksService.removeAssignee(taskId, userId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async update(
    @Body(new ZodValidationPipe(updateTaskSchema)) updateTaskDto: UpdateTaskDto,
    @Param('id') id: string,
  ) {
    return await this.tasksService.update(id, updateTaskDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  remove(@Param('id') id: string) {
    return this.tasksService.remove(id);
  }
}
