import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Session, SessionDocument } from '../schemas/session.schema';
import {
  CreateSessionDto,
  SessionDto,
  FindAllSessionQueryDto,
  FindAllSessionResponseDto,
} from '../dtos/session.dto';
import { User } from 'domain/users/schemas/users.schema';

@Injectable()
export class SessionService {
  constructor(
    @InjectModel(Session.name) private sessionModel: Model<SessionDocument>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async createSession(createSessionDto: CreateSessionDto): Promise<SessionDto> {
    const session = new this.sessionModel({
      ...createSessionDto,
      expiresAt: new Date(createSessionDto.expiresAt),
    });

    const savedSession = await session.save();
    return this.mapToDto(savedSession);
  }

  async validateSession(refreshToken: string): Promise<SessionDto> {
    const session = await this.sessionModel.findOne({
      refreshToken,
      isActive: true,
    });

    if (!session) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (session.isExpired()) {
      session.revoke();
      await session.save();
      throw new UnauthorizedException('Session expired');
    }

    return this.mapToDto(session);
  }

  async revokeSession(sessionId: string, userId: string): Promise<void> {
    const session = await this.sessionModel.findOne({
      id: sessionId,
      userId,
      isActive: true,
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    session.revoke();
    await session.save();
  }

  async revokeAllUserSessions(
    userId: string,
    excludeSessionId?: string,
  ): Promise<void> {
    const query: any = {
      userId,
      isActive: true,
    };

    if (excludeSessionId) {
      query.id = { $ne: excludeSessionId };
    }

    await this.sessionModel.updateMany(query, {
      isActive: false,
      revokedAt: new Date(),
    });
  }

  async revokeSessionByRefreshToken(refreshToken: string): Promise<void> {
    const session = await this.sessionModel.findOne({
      refreshToken,
      isActive: true,
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    session.revoke();
    await session.save();
  }

  async findAllSessions(
    query: FindAllSessionQueryDto,
  ): Promise<FindAllSessionResponseDto> {
    const { userId, isActive, page = '1', limit = '10' } = query;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const filter: any = {};

    if (userId) {
      filter.userId = userId;
    }

    if (isActive !== undefined) {
      filter.isActive = isActive;
    }

    const [sessions, count] = await Promise.all([
      this.sessionModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .exec(),
      this.sessionModel.countDocuments(filter),
    ]);

    return {
      count,
      data: sessions.map((session) => this.mapToDto(session)),
    };
  }

  async findSessionById(sessionId: string): Promise<SessionDto> {
    const session = await this.sessionModel.findOne({ id: sessionId });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    return this.mapToDto(session);
  }

  async findUserSessions(userId: string): Promise<SessionDto[]> {
    const sessions = await this.sessionModel
      .find({ userId, isActive: true })
      .sort({ createdAt: -1 })
      .exec();

    return sessions.map((session) => this.mapToDto(session));
  }

  async cleanupExpiredSessions(): Promise<number> {
    const result = await this.sessionModel.updateMany(
      {
        expiresAt: { $lt: new Date() },
        isActive: true,
      },
      {
        isActive: false,
        revokedAt: new Date(),
      },
    );

    return result.modifiedCount;
  }

  async getActiveSessionCount(userId: string): Promise<number> {
    return this.sessionModel.countDocuments({
      userId,
      isActive: true,
      expiresAt: { $gt: new Date() },
    });
  }

  private mapToDto(session: SessionDocument): SessionDto {
    return {
      id: session.id,
      userId: session.userId,
      refreshToken: session.refreshToken,
      expiresAt: session.expiresAt.toISOString(),
      userAgent: session.userAgent,
      ipAddress: session.ipAddress,
      isActive: session.isActive,
      revokedAt: session.revokedAt?.toISOString(),
      createdAt: session.createdAt.toISOString(),
      updatedAt: session.updatedAt.toISOString(),
    };
  }
}
