import type { User } from "../../../domain";
import { UserResponseDto } from "../../dtos/user/UserResponseDto";
import type { IUserRepository } from "../../interfaces/repositories/IUserRepository";

export class GetUserUseCase {

    constructor(private userRepository: IUserRepository) {}

  async execute(userId: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return new UserResponseDto(user.id,user.email,user.name,user.rol);
  }
}