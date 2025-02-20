import { bcryptAdapter } from "../../config/bcrypt.adapter";
import { JwtAdapter } from "../../config/jwt.adapter";
import { User } from "../../data/mongo/models/user.model";
import { LoginUserDto } from "../../domain/dtos/auth/login-user.dto";
import { RegisterUserDto } from "../../domain/dtos/auth/register-user.dto";
import { UserEntity } from "../../domain/entities/user.entity";
import { CustomError } from "../../domain/errors/custom.error";

export class AuthService {
  constructor() {}

  public async registerUser(registerUserDto: RegisterUserDto) {
    const existUser = await User.findOne({ email: registerUserDto.email });
    if (existUser) throw CustomError.badRequest("Email already exists");

    try {
      const user = await User.create(registerUserDto);

      user.password = bcryptAdapter.hash(registerUserDto.password);

      await user.save();

      const { password, ...userEntity } = UserEntity.fromObject(user);

      return {
        user: userEntity,
        token: "todo token",
      };
    } catch (error) {
      throw CustomError.internalServerError("Error registering user");
    }
  }

  public async loginUser(loginUserDto: LoginUserDto) {
    const user = await User.findOne({ email: loginUserDto.email });

    if (!user) throw CustomError.badRequest("Email not found");

    const isMatching = bcryptAdapter.compare(
      loginUserDto.password,
      user.password
    );
    if (!isMatching) throw CustomError.badRequest("Invalid password");

    const { password, ...userEntity } = UserEntity.fromObject(user);

    const token = await JwtAdapter.generateToken({ id: user.id });
    if (!token) throw CustomError.internalServerError("Error generating token");

    return {
      user: userEntity,
      token,
    };
  }
}
