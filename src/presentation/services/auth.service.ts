import { bcryptAdapter } from "../../config/bcrypt.adapter";
import { envs } from "../../config/envs";
import { JwtAdapter } from "../../config/jwt.adapter";
import { User } from "../../data/mongo/models/user.model";
import { LoginUserDto } from "../../domain/dtos/auth/login-user.dto";
import { RegisterUserDto } from "../../domain/dtos/auth/register-user.dto";
import { UserEntity } from "../../domain/entities/user.entity";
import { CustomError } from "../../domain/errors/custom.error";
import { EmailService } from "./email.service";

export class AuthService {
  constructor(
    private readonly emailService: EmailService,
  ) {}

  public async registerUser(registerUserDto: RegisterUserDto) {
    const existUser = await User.findOne({ email: registerUserDto.email });
    if (existUser) throw CustomError.badRequest("Email already exists");

    try {
      const user = await User.create(registerUserDto);

      user.password = bcryptAdapter.hash(registerUserDto.password);

      await user.save();
      this.sendEmailValidationLink(user.email);

      const { password, ...userEntity } = UserEntity.fromObject(user);

      const token = await JwtAdapter.generateToken({ id: user.id });
      if (!token)
        throw CustomError.internalServerError("Error generating token");

      return {
        user: userEntity,
        token,
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


  private sendEmailValidationLink = async (email: string) => {
    const token = await JwtAdapter.generateToken({ email });
    if (!token) throw CustomError.internalServerError("Error generating token");

    const link = `${ envs.WEBSERVICE_URL }/auth/validate-email/${ token }`;
    const html = `
      <h1>Validate your email</h1>
      <p>Click <a href="${ link }">here</a> to validate your email</p>

      <span>Node and Express project</span>
    `;

    const options = {
      to: email,
      subject: "Validate your email",
      htmlBody: html,
    };

    const isSet = await this.emailService.sendEmail(options);
    if (!isSet) throw CustomError.internalServerError("Error sending email");
  }
}
