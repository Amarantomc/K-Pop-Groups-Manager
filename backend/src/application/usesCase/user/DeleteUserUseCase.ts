import { inject, injectable } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
import type { IUserRepository } from "../../interfaces/repositories/IUserRepository";
import type { IUnitOfWork } from "../../interfaces/IUnitOfWork";

@injectable()
export class DeleteUserUseCase {
  constructor(
    @inject(Types.IUserRepository) private userRepository: IUserRepository,
    @inject (Types.IUnitOfWork) private unitOfWork: IUnitOfWork
  ) {}

  async execute(userId: string): Promise<void> 
  {

    try {   
            await this.unitOfWork.beginTransaction()
            const user = await this.userRepository.findById(userId);
            if (!user) {
                throw new Error('User not found');
            }

            await this.userRepository.delete(userId);
            await this.unitOfWork.commit();
    } catch (error) {
            await this.unitOfWork.rollback();
            throw error;
    }
    

  }
}