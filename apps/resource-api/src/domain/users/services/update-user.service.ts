import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/users.schema';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { UserDto } from '../dtos/user.dto';

@Injectable()
export class UpdateUserService {
  constructor(
    @InjectModel(User.name) private readonly user: Model<UserDocument>,
  ) {}

  async perform(id: string, data: UpdateUserDto): Promise<UserDto> {
    const user = await this.user.findOneAndUpdate(
      { id },
      { $set: data },
      { new: true, runValidators: true },
    );

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return new UserDto({
      id: String(user.get('id')),
      fullName: user.fullName,
      email: user.email,
      cpf: user.cpf,
      position: user.position,
      status: user.status,
      birthDate: user.birthDate.toISOString(),
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    });
  }
}
