import { inject, injectable } from "inversify";
import type { IUserRepository } from "../../interfaces/repositories/IUserRepository";
import { Types } from "../../../infrastructure/di/Types";
import { UserResponseDto } from "../../dtos/user/UserResponseDto";

@injectable()
export class GetUsersUseCase {
  constructor(
    @inject(Types.IUserRepository) private userRepository: IUserRepository
  ) {}

  async execute(): Promise<UserResponseDto[]> {
    const users= await this.userRepository.getUsers()
    return users ? UserResponseDto.fromEntities(users) : []
  }
}