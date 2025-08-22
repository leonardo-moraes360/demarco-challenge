import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export type SessionDocument = HydratedDocument<Session> & {
  isExpired(): boolean;
  revoke(): void;
};

export const SESSION_SCHEMA_NAME = 'Session';

@Schema({ collection: 'sessions', timestamps: true })
export class Session {
  @Prop({
    required: true,
    unique: true,
    index: true,
    default: uuidv4,
  })
  id: string;

  @Prop({
    required: true,
    index: true,
  })
  userId: string;

  @Prop({
    required: true,
    unique: true,
    index: true,
  })
  refreshToken: string;

  @Prop({
    type: Date,
    required: true,
    index: true,
  })
  expiresAt: Date;

  @Prop({
    type: String,
    required: false,
  })
  userAgent?: string;

  @Prop({
    type: String,
    required: false,
  })
  ipAddress?: string;

  @Prop({
    type: Boolean,
    default: true,
  })
  isActive: boolean;

  @Prop({
    type: Date,
    required: false,
  })
  revokedAt?: Date;

  createdAt: Date;

  updatedAt: Date;
}

export const SessionSchema = SchemaFactory.createForClass(Session);

SessionSchema.index({ userId: 1, isActive: 1 });
SessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
SessionSchema.index({ refreshToken: 1, isActive: 1 });

SessionSchema.methods.isExpired = function (): boolean {
  return new Date() > this.expiresAt;
};

SessionSchema.methods.revoke = function (): void {
  this.isActive = false;
  this.revokedAt = new Date();
};
