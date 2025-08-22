import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/users.schema';
import { UserDto } from '../dtos/user.dto';
import { FindAllUserResponseDto } from '../dtos/find-all-user-response.dto';
import { FindAllUserQueryDto } from '../dtos/find-all-user-query.dto';

@Injectable()
export class FindAllUserService {
  constructor(
    @InjectModel(User.name) private readonly user: Model<UserDocument>,
  ) {}

  async perform(params: FindAllUserQueryDto): Promise<FindAllUserResponseDto> {
    const { page = 1, page_size = 10, ...filters } = params;

    const query = {
      ...(filters?.name && {
        fullName: {
          $regex: filters.name,
          $options: 'i',
        },
      }),
      ...(filters?.cpf && { cpf: filters.cpf }),
      ...(filters?.status && { status: filters.status }),
    };

    const [count, data] = await Promise.all([
      this.user.countDocuments(query),
      this.user
        .find(query)
        .skip((page - 1) * page_size)
        .limit(page_size),
    ]);

    return new FindAllUserResponseDto({
      count,
      data: data.map(
        (user) =>
          new UserDto({
            id: String(user.get('id')),
            fullName: user.fullName,
            email: user.email,
            cpf: user.cpf,
            position: user.position,
            status: user.status,
            birthDate: user.birthDate.toISOString(),
            createdAt: user.createdAt.toISOString(),
            updatedAt: user.updatedAt.toISOString(),
          }),
      ),
    });
  }
}
