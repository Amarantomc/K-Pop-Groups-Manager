import { inject, injectable } from "inversify";
import type { IUserRepository } from "../../interfaces/repositories/IUserRepository";
import { Types } from "../../../infrastructure/di/Types";
import type { LoginRequestDto } from "../../dtos/user/LoginRequestDto";
import { LoginResponseDto } from "../../dtos/user/LoginResponseDto";
import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'


@injectable()
export class LoginUserUseCase {
  constructor(
    @inject(Types.IUserRepository) private userRepository: IUserRepository
  ) {}

  async execute(command: LoginRequestDto): Promise<LoginResponseDto> {
    const user = await this.userRepository.findByEmail(command.email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isValidPassword = await bcrypt.compare(command.password, user.password);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }
 
    
    const token = jwt.sign(
      { userId: user.id, email: user.email, role:user.rol },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '24h' }
    );
    

    return LoginResponseDto.fromEntity({user,token});
  }
}