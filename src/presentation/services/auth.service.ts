import { User } from "../../data/mongo/models/user.model";
import { RegisterUserDto } from "../../domain/dtos/auth/register-user.dto";
import { CustomError } from "../../domain/errors/custom.error";

export class AuthService {
  constructor() {}

  public async registerUser( registerUserDto: RegisterUserDto ) {
    const existUser = await User.findOne({ email: registerUserDto.email });
    if (existUser) throw CustomError.badRequest('Email already exists');

    try {
      const user = await User.create(registerUserDto);
      await user.save();

      return user;
    } catch (error) {
      throw CustomError.internalServerError('Error registering user');
    }

    return 'todo ok';

  }
}