import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class Escrow extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  senderId: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  recipientId: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true, enum: ['funded', 'released', 'refunded'] })
  status: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const EscrowSchema = SchemaFactory.createForClass(Escrow);