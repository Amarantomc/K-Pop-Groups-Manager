import type { Apprentice } from "../../../domain";
import type { CreateApprenticeDto } from "../../dtos/apprentice/CreateApprenticeDto";
import { ApprenticeResponseDto } from "../../dtos/apprentice/ApprenticeResponseDto";
import type { IUnitOfWork } from "../../interfaces/IUnitOfWork";
import type { IApprenticeRepository } from "../../interfaces/repositories/IApprenticeRepository";
import { inject, injectable } from "inversify";
import { Types } from "../../../infrastructure/di/Types";
import e from "express";


@injectable()
export class CreateApprenticeUseCase{

    constructor(
    @inject(Types.IApprenticeRepository) private apprenticeRepository: IApprenticeRepository,
    @inject(Types.IUnitOfWork)  private unitOfWork: IUnitOfWork
  ) {}

    async execute(command:CreateApprenticeDto):Promise<ApprenticeResponseDto>{
        try
        {   
            
            await this.unitOfWork.beginTransaction();
            const apprentice = await this.apprenticeRepository.create(command);
            await this.unitOfWork.commit();
            
            return new ApprenticeResponseDto(
                apprentice.id,
                apprentice.name,
                apprentice.dateOfBirth,
                apprentice.age,
                apprentice.trainingLv,
                apprentice.status
            );
        }
        catch(error){
            
            await this.unitOfWork.rollback();
            throw error;
        }
      }
}