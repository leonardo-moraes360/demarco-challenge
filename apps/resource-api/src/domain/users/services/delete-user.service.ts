import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/users.schema';
import { StatusEnum } from 'common/enums/status.enum';

@Injectable()
export class DeleteUserService {
  constructor(
    @InjectModel(User.name) private readonly user: Model<UserDocument>,
  ) {}

  async perform(id: string): Promise<void> {
    const user = await this.user.findOneAndUpdate(
      { id },
      { $set: { status: StatusEnum.INACTIVE } },
      { new: true, runValidators: true },
    );

    if (!user) {
      throw new NotFoundException('User not found');
    }
  }
}
