import { inject, injectable } from "inversify";
import type { User } from "../../../domain";
import type { CreateUserDto } from "../../dtos/user/CreateUserDto";
import { UserResponseDto } from "../../dtos/user/UserResponseDto";
import type { IUnitOfWork } from "../../interfaces/IUnitOfWork";
import type { IUserRepository } from "../../interfaces/repositories/IUserRepository";
import * as bcrypt from 'bcrypt'
import { Types } from "../../../infrastructure/di/Types";
 @injectable()
export class CreateUserUseCase{

    constructor(
    @inject(Types.IUserRepository) private userRepository: IUserRepository,
    @inject (Types.IUnitOfWork) private unitOfWork: IUnitOfWork
  ) {}

  async execute(command:CreateUserDto):Promise<UserResponseDto>
  {
        try{
            await this.unitOfWork.beginTransaction()
             
            const existingUser = await this.userRepository.findByEmail(command.email);
            if (existingUser) {
        throw new Error('User with this email already exists');
            }

            const hashedPassword = await bcrypt.hash(command.GetPassword(), 12);
            command.SetHashedPassword(hashedPassword)

            
            const user = await this.userRepository.create(command);
             
            await this.unitOfWork.commit();
            return UserResponseDto.fromEntity(user)
        }
        catch(error){
            await this.unitOfWork.rollback();
            throw error;
        }
  }
}