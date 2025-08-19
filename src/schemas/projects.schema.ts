import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from './users.schema';

export type ProjectDocument = HydratedDocument<Project>;

@Schema()
export class Project {
  @Prop({ required: true, unique: true, index: true })
  name: string;

  @Prop({ index: true })
  description: string;

  @Prop({
    default: 'https://cdn-icons-png.flaticon.com/512/10446/10446694.png',
  })
  icon: string;

  @Prop({ default: '' })
  iconKey: string;

  @Prop({
    default:
      'https://fastly.picsum.photos/id/6/5000/3333.jpg?hmac=pq9FRpg2xkAQ7J9JTrBtyFcp9-qvlu8ycAi7bUHlL7I',
  })
  banner: string;

  @Prop({ default: '' })
  bannerKey: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  createdBy: User;

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'User',
  })
  members: User[];

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

const ProjectSchema = SchemaFactory.createForClass(Project);
ProjectSchema.index({ name: 'text', description: 'text' });

export { ProjectSchema };
