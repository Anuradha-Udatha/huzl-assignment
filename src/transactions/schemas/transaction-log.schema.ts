import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type TransactionLogDocument = TransactionLog & Document;

@Schema({ timestamps: true }) 
export class TransactionLog {
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'User',}) userId: string;
  @Prop({ required: true }) type: 'fund' | 'release' | 'refund' | 'add' | 'withdraw';
  @Prop({ required: true }) amount: number;
  @Prop({ required: true }) balanceAfter: number;
  @Prop() escrowId?: string; 
}

export const TransactionLogSchema = SchemaFactory.createForClass(TransactionLog);
