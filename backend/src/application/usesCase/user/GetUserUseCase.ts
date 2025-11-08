import { inject, injectable } from "inversify";
import type { User } from "../../../domain";
import { UserResponseDto } from "../../dtos/user/UserResponseDto";
import type { IUserRepository } from "../../interfaces/repositories/IUserRepository";
import { Types } from "../../../infrastructure/di/Types";

@injectable() 
export class GetUserUseCase {

    constructor( @inject(Types.IUserRepository)private userRepository: IUserRepository) {}

  async execute(userId: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return new UserResponseDto(user.id,user.email,user.name,user.rol);
  }
}