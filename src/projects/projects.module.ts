import { Module } from '@nestjs/common';
import { ProjectService } from './projects.service';
import { ProjectController } from './projects.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Project, ProjectSchema } from '../schemas/projects.schema';
import { User, UserSchema } from '../schemas/users.schema';
import { AuthModule } from '../auth/auth.module';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { TasksService } from 'src/tasks/tasks.service';
import { Task, TaskSchema } from 'src/schemas/tasks.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Project.name, schema: ProjectSchema },
      { name: User.name, schema: UserSchema },
      { name: Task.name, schema: TaskSchema },
    ]),
    AuthModule,
  ],
  controllers: [ProjectController],
  providers: [ProjectService, TasksService, CloudinaryService],
})
export class ProjectModule {}
