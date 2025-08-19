import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Error, Model } from 'mongoose';
import { Project } from '../schemas/projects.schema';
import { Utils } from 'src/utils/Utils';
import { User } from 'src/schemas/users.schema';
import { JwtPayload } from 'src/auth/auth.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { TasksService } from 'src/tasks/tasks.service';
import { MongoServerError } from 'mongodb';

const FOLDER_NAME = 'projects';

@Injectable()
export class ProjectService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<Project>,
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly cloudinaryService: CloudinaryService,
    private readonly tasksService: TasksService,
  ) {}

  async create(
    createProjectDto: CreateProjectDto,
    user: JwtPayload,
    icon?: Express.Multer.File,
    banner?: Express.Multer.File,
  ) {
    if (!user) {
      throw new UnauthorizedException(
        'Creator not found while creating project',
      );
    }

    try {
      if (icon) {
        const iconResult = await this.cloudinaryService.uploadFile(
          icon,
          FOLDER_NAME,
        );
        if (iconResult) {
          createProjectDto.icon = iconResult.secure_url;
          createProjectDto.iconKey = iconResult.public_id;
        }
      }

      if (banner) {
        const bannerResult = await this.cloudinaryService.uploadFile(
          banner,
          FOLDER_NAME,
        );
        if (bannerResult) {
          createProjectDto.banner = bannerResult.secure_url;
          createProjectDto.bannerKey = bannerResult.public_id;
        }
      }

      const createdProject = await this.projectModel.create({
        ...createProjectDto,
        members: [user.userId],
        createdBy: user.userId,
      });
      return {
        data: createdProject,
        message: 'Project created successfully',
        success: true,
      };
    } catch (error) {
      if (
        error instanceof MongoServerError &&
        error.code === 11000 &&
        error.keyPattern &&
        (error.keyPattern as { name: number }).name
      ) {
        throw new BadRequestException('Same project name already exists');
      } else if (error instanceof Error.ValidationError) {
        const validationErrors = Object.values(error.errors).map(
          (err: Error) => err.message,
        );
        throw new BadRequestException({
          success: false,
          message: 'Validation failed',
          errors: validationErrors,
        });
      }

      throw new BadRequestException(error);
    }
  }

  async findAll() {
    const projects = await this.projectModel
      .find()
      .populate<{ createdBy: User }>('createdBy')
      .populate<{ members: User[] }>('members');
    return {
      data: projects,
      message: 'Projects fetched successfully',
      success: true,
    };
  }

  async searchProjects(term: string) {
    const projects = await this.projectModel
      .find({ $text: { $search: term } })
      .populate<{ createdBy: User }>('createdBy')
      .populate<{ members: User[] }>('members');
    return {
      data: projects,
      message: 'Projects fetched successfully',
      success: true,
    };
  }

  async findOne(id: string) {
    if (!Utils.isObjectId(id)) {
      throw new BadRequestException('Invalid ObjectId passed as id');
    }

    const project = await this.projectModel.findById(id);
    if (!project) {
      throw new NotFoundException('Project not found');
    }
    return {
      data: project,
      message: 'Project fetched successfully',
      success: true,
    };
  }

  async update(
    id: string,
    updateProjectDto: UpdateProjectDto,
    icon?: Express.Multer.File,
    banner?: Express.Multer.File,
  ) {
    if (!Utils.isObjectId(id)) {
      throw new BadRequestException('Invalid ObjectId passed as id');
    }

    try {
      const existingProject = await this.projectModel.findById(id);
      if (!existingProject) {
        throw new NotFoundException('Project not found');
      }

      if (icon) {
        if (existingProject.iconKey) {
          try {
            await this.cloudinaryService.deleteFile(existingProject.iconKey);
          } catch (deleteError) {
            console.error('Failed to delete old icon:', deleteError);
          }
        }

        const iconResult = await this.cloudinaryService.uploadFile(
          icon,
          FOLDER_NAME,
        );
        if (iconResult) {
          updateProjectDto.icon = iconResult.secure_url;
          updateProjectDto.iconKey = iconResult.public_id;
        } else {
          throw new BadRequestException('Cloudinary icon upload failed');
        }
      }

      if (banner) {
        if (existingProject.bannerKey) {
          try {
            await this.cloudinaryService.deleteFile(existingProject.bannerKey);
          } catch (deleteError) {
            console.error('Failed to delete old banner:', deleteError);
          }
        }

        const bannerResult = await this.cloudinaryService.uploadFile(
          banner,
          FOLDER_NAME,
        );
        if (bannerResult) {
          updateProjectDto.banner = bannerResult.secure_url;
          updateProjectDto.bannerKey = bannerResult.public_id;
        } else {
          throw new BadRequestException('Cloudinary banner upload failed');
        }
      }

      const updatedProject = await this.projectModel.findByIdAndUpdate(
        id,
        updateProjectDto,
        { runValidators: true, new: true },
      );

      if (!updatedProject) {
        throw new NotFoundException('Project not found');
      }

      return {
        data: updatedProject,
        message: 'Project updated successfully',
        success: true,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else if (error instanceof Error.ValidationError) {
        const validationErrors = Object.values(error.errors).map(
          (err: Error) => err.message,
        );
        throw new BadRequestException({
          success: false,
          message: 'Validation failed',
          errors: validationErrors,
        });
      }

      throw new BadRequestException(error);
    }
  }

  async remove(id: string) {
    if (!Utils.isObjectId(id)) {
      throw new BadRequestException('Invalid ObjectId passed as id');
    }

    // =============== get project before deletion to delete images ================
    const projectToDelete = await this.projectModel.findById(id);
    if (!projectToDelete) {
      throw new NotFoundException('Project not found');
    }

    // =============== delete images from cloudinary if they exist ================
    if (projectToDelete.iconKey) {
      try {
        await this.cloudinaryService.deleteFile(projectToDelete.iconKey);
      } catch (deleteError) {
        console.error('Failed to delete icon:', deleteError);
      }
    }

    if (projectToDelete.bannerKey) {
      try {
        await this.cloudinaryService.deleteFile(projectToDelete.bannerKey);
      } catch (deleteError) {
        console.error('Failed to delete banner:', deleteError);
      }
    }

    const deletedProject = await this.projectModel.findByIdAndDelete(id);
    await this.tasksService.removeProjectTasks(id);

    return {
      data: deletedProject,
      message: 'Project deleted successfully',
      success: true,
    };
  }

  async joinProject(projectId: string, userId: string) {
    if (!Utils.isObjectId(projectId)) {
      throw new BadRequestException('Invalid ObjectId passed as projectId');
    }
    if (!userId) {
      throw new UnauthorizedException('User not found');
    }

    const foundUser = await this.userModel.findById(userId);
    if (!foundUser) {
      throw new NotFoundException('User not found');
    }

    const project = await this.projectModel.findByIdAndUpdate(
      projectId,
      {
        $addToSet: {
          members: userId,
        },
      },
      { new: true },
    );

    return {
      data: project,
      message: 'Joined project successfully',
      success: true,
    };
  }

  async leaveProject(projectId: string, userId: string) {
    if (!Utils.isObjectId(projectId)) {
      throw new BadRequestException('Invalid ObjectId passed as projectId');
    }
    if (!userId) {
      throw new UnauthorizedException('User not found');
    }

    const project = await this.projectModel.findByIdAndUpdate(
      projectId,
      {
        $pull: {
          members: userId,
        },
      },
      { new: true },
    );

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return {
      data: project,
      message: 'Left project successfully',
      success: true,
    };
  }
}
