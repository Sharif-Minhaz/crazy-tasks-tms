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
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ProjectService } from './projects.service';
import {
  CreateProjectDto,
  createProjectSchema,
} from './dto/create-project.dto';
import {
  UpdateProjectDto,
  updateProjectSchema,
} from './dto/update-project.dto';
import { ZodValidationPipe } from '../pipes/zodValidationPipe';
import { AdminGuard } from 'src/guards/admin.guard';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { JwtPayload } from 'src/auth/auth.service';

type UploadedProjectFiles = {
  icon?: Express.Multer.File[];
  banner?: Express.Multer.File[];
};

@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'icon', maxCount: 1 },
      { name: 'banner', maxCount: 1 },
    ]),
  )
  create(
    @Req() req: { user: JwtPayload },
    @Body(new ZodValidationPipe(createProjectSchema))
    createProjectDto: CreateProjectDto,
    @UploadedFiles()
    files: UploadedProjectFiles,
  ) {
    const icon = files.icon?.[0];
    const banner = files.banner?.[0];

    return this.projectService.create(createProjectDto, req.user, icon, banner);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.projectService.findAll();
  }

  @Get('search')
  @UseGuards(JwtAuthGuard)
  searchProjects(@Query('term') term: string) {
    return this.projectService.searchProjects(term);
  }

  @Patch('join')
  @UseGuards(JwtAuthGuard)
  joinProject(
    @Query('projectId') projectId: string,
    @Query('userId') userId: string,
  ) {
    return this.projectService.joinProject(projectId, userId);
  }

  @Patch('leave')
  @UseGuards(JwtAuthGuard)
  leaveProject(
    @Query('projectId') projectId: string,
    @Query('userId') userId: string,
  ) {
    return this.projectService.leaveProject(projectId, userId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.projectService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'icon', maxCount: 1 },
      { name: 'banner', maxCount: 1 },
    ]),
  )
  update(
    @Body(new ZodValidationPipe(updateProjectSchema))
    updateProjectDto: UpdateProjectDto,
    @Param('id') id: string,
    @UploadedFiles()
    files: UploadedProjectFiles,
  ) {
    const icon = files.icon?.[0];
    const banner = files.banner?.[0];

    return this.projectService.update(id, updateProjectDto, icon, banner);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  remove(@Param('id') id: string) {
    return this.projectService.remove(id);
  }
}
