import * as argon2 from 'argon2';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/schemas/users.schema';
import { MongoServerError } from 'mongodb';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const hashedPassword = await argon2.hash(createUserDto.password);

      return await this.userModel.create({
        ...createUserDto,
        password: hashedPassword,
      });
    } catch (error) {
      if (
        error instanceof MongoServerError &&
        error.code === 11000 &&
        error.keyPattern &&
        (error.keyPattern as { email: number }).email
      ) {
        throw new BadRequestException('Email already in use');
      }
      throw new BadRequestException(error);
    }
  }

  findAll() {
    return this.userModel.find();
  }

  findOne(id: string) {
    return this.userModel.findById(id);
  }

  findOneByEmail(email: string) {
    return this.userModel.findOne({ email }).select('+password');
  }

  async findOneByRefreshToken(refreshToken: string) {
    const user = await this.userModel
      .findOne({ refreshTokenHash: { $ne: null } })
      .select('+refreshTokenHash');

    if (user?.refreshTokenHash) {
      const valid = await argon2.verify(user.refreshTokenHash, refreshToken);
      if (valid) {
        return user;
      }
    }

    return null;
  }

  update(id: string, updateUserDto: Partial<User>) {
    return this.userModel.findByIdAndUpdate(id, updateUserDto);
  }

  remove(id: string) {
    return this.userModel.findByIdAndDelete(id);
  }
}
