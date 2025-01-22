import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Escrow extends Document {
  @Prop({ required: true })
  senderId: string;

  @Prop({ required: true })
  recipientId: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ default: 'funded', enum: ['funded', 'released', 'refunded'] })
  status: string;
}

export const EscrowSchema = SchemaFactory.createForClass(Escrow);