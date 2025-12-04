import { inject, injectable } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
import type { IUserRepository } from "../../interfaces/repositories/IUserRepository";

import * as bcrypt from 'bcrypt'

import { UserResponseDto } from "../../dtos/user/UserResponseDto";
import type { IUnitOfWork } from "../../interfaces/IUnitOfWork";
import type { UpdateUserDto } from "../../dtos/user/UpdateUserDto";


@injectable()
export class UpdateUserUseCase {
  constructor(
    @inject(Types.IUserRepository) private userRepository: IUserRepository,
    @inject (Types.IUnitOfWork) private unitOfWork: IUnitOfWork
  ) {}

  async execute(data: Partial<UpdateUserDto>): Promise<UserResponseDto> 
  {
    
    try {   
            await this.unitOfWork.beginTransaction()
            
            const user = await this.userRepository.findById(data.id!);
            if (!user) {
            throw new Error('User not found');
            }
            
            if(data.password){
              const hashedPassword = await bcrypt.hash(data.password.toString(), 12);
              data.password=hashedPassword
              
            }
            
            const updateUser=await this.userRepository.update(data.id!,data);
            await this.unitOfWork.commit();
            
            return UserResponseDto.fromEntity(updateUser)
    } catch (error) {
       await this.unitOfWork.rollback();
            throw error;
    }

  }
}