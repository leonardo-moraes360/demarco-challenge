import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from 'domain/users/controllers/users.controller';
import { CreateUserService } from 'domain/users/services/create-user.service';
import { FindOneUserService } from 'domain/users/services/find-one-user.service';
import { FindAllUserService } from 'domain/users/services/find-all-user.service';
import { UpdateUserService } from 'domain/users/services/update-user.service';
import { DeleteUserService } from 'domain/users/services/delete-user.service';
import { User, UserSchema } from 'domain/users/schemas/users.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  controllers: [UsersController],
  providers: [
    CreateUserService,
    FindOneUserService,
    FindAllUserService,
    UpdateUserService,
    DeleteUserService,
  ],
})
export class UsersModule {}
