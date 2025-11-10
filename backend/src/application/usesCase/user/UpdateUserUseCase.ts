import { inject, injectable } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
import type { IUserRepository } from "../../interfaces/repositories/IUserRepository";
import { CreateUserDto } from "../../dtos/user/CreateUserDto";

import { UserResponseDto } from "../../dtos/user/UserResponseDto";
import type { IUnitOfWork } from "../../interfaces/IUnitOfWork";


@injectable()
export class UpdateUserUseCase {
  constructor(
    @inject(Types.IUserRepository) private userRepository: IUserRepository,
    @inject (Types.IUnitOfWork) private unitOfWork: IUnitOfWork
  ) {}

  async execute(  userId: string, data: Partial<CreateUserDto>): Promise<UserResponseDto> 
  {
    
    try {   
            await this.unitOfWork.beginTransaction()
            const user = await this.userRepository.findById(userId);
            if (!user) {
            throw new Error('User not found');
            }

            const updateUser=await this.userRepository.update(userId,data);
            await this.unitOfWork.commit();
            return UserResponseDto.fromEntity(updateUser)
    } catch (error) {
         await this.unitOfWork.rollback();
            throw error;
    }

  }
}