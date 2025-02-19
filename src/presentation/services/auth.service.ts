import { bcryptAdapter } from "../../config/bcrypt.adapter";
import { User } from "../../data/mongo/models/user.model";
import { RegisterUserDto } from "../../domain/dtos/auth/register-user.dto";
import { UserEntity } from "../../domain/entities/user.entity";
import { CustomError } from "../../domain/errors/custom.error";

export class AuthService {
  constructor() {}

  public async registerUser( registerUserDto: RegisterUserDto ) {
    const existUser = await User.findOne({ email: registerUserDto.email });
    if (existUser) throw CustomError.badRequest('Email already exists');

    try {
      const user = await User.create(registerUserDto);

      user.password = bcryptAdapter.hash(registerUserDto.password);

      await user.save();

      const { password, ...userEntity } = UserEntity.fromObject(user);

      return {
        user: userEntity,
        token: 'todo token'
      };

    } catch (error) {
      throw CustomError.internalServerError('Error registering user');
    }

    return 'todo ok';

  }
}