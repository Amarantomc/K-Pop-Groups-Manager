import type { User } from "../../../domain";
import type { CreateUserDto } from "../../dtos/user/CreateUserDto";
import { UserResponseDto } from "../../dtos/user/UserResponseDto";
import type { IUnitOfWork } from "../../interfaces/IUnitOfWork";
import type { IUserRepository } from "../../interfaces/repositories/IUserRepository";
import * as bcrypt from 'bcrypt'

export class CreateUserUseCase{

    constructor(
    private userRepository: IUserRepository,
    private unitOfWork: IUnitOfWork
  ) {}

  async execute(command:CreateUserDto):Promise<UserResponseDto>
  {
        try{
            await this.unitOfWork.beginTransaction()
            console.log("OK3")
            //const existingUser = await this.userRepository.findByEmail(command.email);
        //     if (existingUser) {
        // throw new Error('User with this email already exists');
        //     }

            const hashedPassword = await bcrypt.hash(command.password, 12);

            const user = await this.userRepository.create(command);
            console.log("OK4")
            await this.unitOfWork.commit();
            return new UserResponseDto(user.id,user.email,user.name,user.rol)
        }
        catch(error){
            await this.unitOfWork.rollback();
            throw error;
        }
  }
}