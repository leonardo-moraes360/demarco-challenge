import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/users.schema';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UserDto } from '../dtos/user.dto';

@Injectable()
export class CreateUserService {
  constructor(
    @InjectModel(User.name) private readonly user: Model<UserDocument>,
  ) {}

  async perform(data: CreateUserDto): Promise<UserDto> {
    const user = new this.user({
      ...data,
      passwordHash: data.password,
    });

    const document = await user.save();

    return new UserDto({
      id: String(document.get('id')),
      fullName: document.fullName,
      email: document.email,
      cpf: document.cpf,
      position: document.position,
      status: document.status,
      birthDate: document.birthDate.toISOString(),
      createdAt: document.createdAt.toISOString(),
      updatedAt: document.updatedAt.toISOString(),
    });
  }
}
