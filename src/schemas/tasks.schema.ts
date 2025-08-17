import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from './users.schema';

export enum TaskStatus {
  OPEN = 'open',
  PROGRESS = 'progress',
  COMPLETED = 'completed',
}

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export type TaskDocument = HydratedDocument<Task>;

@Schema()
export class Task {
  @Prop({ required: true, index: true })
  title: string;

  @Prop({ index: true })
  description: string;

  @Prop({
    type: String,
    default: TaskStatus.OPEN,
    enum: TaskStatus,
  })
  status: TaskStatus;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  owner: User;

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'User',
  })
  assignee: User[];

  @Prop({ default: Date.now })
  startDate: Date;

  @Prop({ default: Date.now })
  dueDate: Date;

  @Prop({ default: TaskPriority.LOW, enum: TaskPriority })
  priority: TaskPriority;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

const TaskSchema = SchemaFactory.createForClass(Task);
TaskSchema.index({ title: 'text', description: 'text' });

export { TaskSchema };
